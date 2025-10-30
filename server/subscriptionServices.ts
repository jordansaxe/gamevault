import { storage } from "./storage";

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

  private normalizeTitle(title: string): string {
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

  async updateSubscriptionData(): Promise<void> {
    console.log('Starting subscription catalog update...');
    const startTime = Date.now();

    const [gamePassGames, psPlusGames, geforceGames] = await Promise.all([
      this.fetchGamePassCatalog(),
      this.fetchPSPlusCatalog(),
      this.fetchGeForceNowCatalog(),
    ]);

    console.log(`Fetched catalogs: Game Pass (${gamePassGames.length}), PS+ (${psPlusGames.length}), GeForce NOW (${geforceGames.length})`);

    const allGames = await storage.getAllGamesForSubscriptionUpdate();
    console.log(`Matching against ${allGames.length} games in database...`);

    let updateCount = 0;
    for (const game of allGames) {
      const gamePassConsole = gamePassGames.some(gp => 
        this.titlesMatch(game.name, gp.title) && 
        (!gp.supportedPlatforms || gp.supportedPlatforms.some(p => p.toLowerCase().includes('console')))
      );
      
      const gamePassPC = gamePassGames.some(gp => 
        this.titlesMatch(game.name, gp.title) && 
        (!gp.supportedPlatforms || gp.supportedPlatforms.some(p => p.toLowerCase().includes('pc')))
      );
      
      const psPlus = psPlusGames.some(ps => this.titlesMatch(game.name, ps.title));
      
      const geforceNow = geforceGames.some(gfn => this.titlesMatch(game.name, gfn.title));

      await storage.updateGameSubscriptions(game.igdbId, {
        gamePassConsole,
        gamePassPC,
        psPlus,
        geforceNow,
      });
      
      if (gamePassConsole || gamePassPC || psPlus || geforceNow) {
        updateCount++;
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✓ Subscription update complete: ${updateCount} games matched in ${duration}s`);
  }
}

export const subscriptionService = new SubscriptionService();
