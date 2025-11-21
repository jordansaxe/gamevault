import { storage } from "./storage";
import { igdbService } from "./igdb";

interface GamePassGame {
  id: string;
  title: string;
  supportedPlatforms?: string[];
}

interface PSPlusGame {
  title: string;
}

interface GeForceNowGame {
  title: string;
}

export class SubscriptionService {
  private gamePassCatalog: GamePassGame[] = [];
  private psPlusCatalog: PSPlusGame[] = [];
  private geforceNowCatalog: GeForceNowGame[] = [];
  private catalogLastUpdated: Date | null = null;
  private initializationPromise: Promise<void> | null = null;
  private subscriptionCache: Map<number, {
    gamePassConsole: boolean;
    gamePassPC: boolean;
    psPlus: boolean;
    geforceNow: boolean;
    cachedAt: Date;
  }> = new Map();
  private async fetchGamePassCatalog(): Promise<GamePassGame[]> {
    try {
      const response = await fetch(
        'https://catalog.gamepass.com/sigls/v2?id=fdd9e2a7-0fee-49f6-ad69-4354098401ff&language=en-us&market=US',
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.error('Game Pass API error:', response.statusText);
        return [];
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Failed to fetch Game Pass catalog:', error);
      return [];
    }
  }

  private async fetchPSPlusCatalog(): Promise<PSPlusGame[]> {
    try {
      const response = await fetch('https://psdeals.net/ca-store/collection/ps_plus_game_catalog');
      
      if (!response.ok) {
        console.error('PS+ scrape error:', response.statusText);
        return [];
      }

      const html = await response.text();
      
      const gameMatches = Array.from(html.matchAll(/(\d+)[a-zA-Z\s]+([^<\n]+)<\/a>/g));
      const games: PSPlusGame[] = [];
      const seenTitles = new Set<string>();

      for (const match of gameMatches) {
        const title = match[2]?.trim();
        if (title && title.length > 2 && !seenTitles.has(title)) {
          seenTitles.add(title);
          games.push({ title });
        }
      }

      console.log(`Found ${games.length} PS+ games`);
      return games;
    } catch (error) {
      console.error('Failed to fetch PS+ catalog:', error);
      return [];
    }
  }

  private async fetchGeForceNowCatalog(): Promise<GeForceNowGame[]> {
    try {
      const response = await fetch('https://www.nvidia.com/en-us/geforce-now/games/');
      
      if (!response.ok) {
        console.error('GeForce NOW scrape error:', response.statusText);
        return [];
      }

      const html = await response.text();
      
      const gameMatches = Array.from(html.matchAll(/data-game-name="([^"]+)"/g));
      const games: GeForceNowGame[] = [];
      const seenTitles = new Set<string>();

      for (const match of gameMatches) {
        const title = match[1]?.trim();
        if (title && !seenTitles.has(title)) {
          seenTitles.add(title);
          games.push({ title });
        }
      }

      console.log(`Found ${games.length} GeForce NOW games`);
      return games;
    } catch (error) {
      console.error('Failed to fetch GeForce NOW catalog:', error);
      return [];
    }
  }

  private normalizeTitle(title: string | undefined | null): string {
    if (!title) return '';
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private titlesMatch(title1: string, title2: string): boolean {
    const norm1 = this.normalizeTitle(title1);
    const norm2 = this.normalizeTitle(title2);
    
    if (norm1 === norm2) return true;
    
    if (norm1.includes(norm2) || norm2.includes(norm1)) {
      const longer = norm1.length > norm2.length ? norm1 : norm2;
      const shorter = norm1.length > norm2.length ? norm2 : norm1;
      if (longer.startsWith(shorter) || longer.endsWith(shorter)) {
        return true;
      }
    }
    
    return false;
  }

  async initialize(): Promise<void> {
    if (!this.initializationPromise) {
      this.initializationPromise = this.updateSubscriptionData();
    }
    return this.initializationPromise;
  }

  async ensureInitialized(): Promise<void> {
    if (!this.catalogLastUpdated) {
      await this.initialize();
    }
  }

  async updateSubscriptionData(): Promise<void> {
    console.log('Starting subscription catalog update...');
    const startTime = Date.now();

    try {
      const [gamePassGames, psPlusGames, geforceGames] = await Promise.all([
        this.fetchGamePassCatalog(),
        this.fetchPSPlusCatalog(),
        this.fetchGeForceNowCatalog(),
      ]);

      this.gamePassCatalog = gamePassGames;
      this.psPlusCatalog = psPlusGames;
      this.geforceNowCatalog = geforceGames;
      this.catalogLastUpdated = new Date();

      console.log(`Fetched catalogs: Game Pass (${gamePassGames.length}), PS+ (${psPlusGames.length}), GeForce NOW (${geforceGames.length})`);

      const allGames = await storage.getAllGamesForSubscriptionUpdate();
      console.log(`Matching against ${allGames.length} games in database...`);

      let updateCount = 0;
      for (const game of allGames) {
        const subscriptions = this.checkGameSubscriptions(game.name);

        await storage.updateGameSubscriptions(game.igdbId, subscriptions);
        
        if (subscriptions.gamePassConsole || subscriptions.gamePassPC || subscriptions.psPlus || subscriptions.geforceNow) {
          updateCount++;
        }
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`✓ Subscription update complete: ${updateCount} games matched in ${duration}s`);
    } catch (error) {
      console.error('Failed to update subscription data:', error);
      this.initializationPromise = null;
      throw error;
    }
  }

  checkGameSubscriptions(gameName: string): {
    gamePassConsole: boolean;
    gamePassPC: boolean;
    psPlus: boolean;
    geforceNow: boolean;
  } {
    const gamePassConsole = this.gamePassCatalog.some(gp => 
      this.titlesMatch(gameName, gp.title) && 
      (!gp.supportedPlatforms || gp.supportedPlatforms.some(p => p?.toLowerCase().includes('console')))
    );
    
    const gamePassPC = this.gamePassCatalog.some(gp => 
      this.titlesMatch(gameName, gp.title) && 
      (!gp.supportedPlatforms || gp.supportedPlatforms.some(p => p?.toLowerCase().includes('pc')))
    );
    
    const psPlus = this.psPlusCatalog.some(ps => this.titlesMatch(gameName, ps.title));
    
    const geforceNow = this.geforceNowCatalog.some(gfn => this.titlesMatch(gameName, gfn.title));

    return {
      gamePassConsole,
      gamePassPC,
      psPlus,
      geforceNow,
    };
  }

  async checkGameSubscriptionsById(igdbId: number, gameName: string): Promise<{
    gamePassConsole: boolean;
    gamePassPC: boolean;
    psPlus: boolean;
    geforceNow: boolean;
  }> {
    await this.ensureInitialized();

    const cached = this.subscriptionCache.get(igdbId);
    if (cached) {
      const cacheAge = Date.now() - cached.cachedAt.getTime();
      if (cacheAge < 24 * 60 * 60 * 1000) {
        return {
          gamePassConsole: cached.gamePassConsole,
          gamePassPC: cached.gamePassPC,
          psPlus: cached.psPlus,
          geforceNow: cached.geforceNow,
        };
      }
    }

    const subscriptions = this.checkGameSubscriptions(gameName);
    
    this.subscriptionCache.set(igdbId, {
      ...subscriptions,
      cachedAt: new Date(),
    });

    return subscriptions;
  }
}

export const subscriptionService = new SubscriptionService();
