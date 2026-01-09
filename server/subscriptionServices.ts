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
      const siglsResponse = await fetch(
        'https://catalog.gamepass.com/sigls/v2?id=fdd9e2a7-0fee-49f6-ad69-4354098401ff&language=en-us&market=US',
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!siglsResponse.ok) {
        console.error('Game Pass API error:', siglsResponse.statusText);
        return [];
      }

      const siglsData = await siglsResponse.json();
      const productIds = siglsData
        .filter((item: any) => item.id && item.id !== 'fdd9e2a7-0fee-49f6-ad69-4354098401ff')
        .map((item: any) => item.id)
        .slice(0, 500);

      if (productIds.length === 0) {
        console.log('No product IDs found in Game Pass catalog');
        return [];
      }

      const productsResponse = await fetch(
        `https://displaycatalog.mp.microsoft.com/v7.0/products?market=US&languages=en-us&bigIds=${productIds.join(',')}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!productsResponse.ok) {
        console.error('Game Pass products API error:', productsResponse.statusText);
        return [];
      }

      const productsData = await productsResponse.json();
      const games: GamePassGame[] = [];

      for (const product of productsData.Products || []) {
        const title = product.LocalizedProperties?.[0]?.ProductTitle;
        if (!title) continue;

        const platforms: string[] = [];
        const packagePlatforms = product.Properties?.PackagePlatforms || [];
        
        for (const platform of packagePlatforms) {
          if (platform.includes('Xbox') || platform.includes('Scarlett') || platform.includes('XboxOne')) {
            platforms.push('console');
          }
          if (platform.includes('Windows') || platform.includes('PC')) {
            platforms.push('pc');
          }
        }

        games.push({
          id: product.ProductId,
          title,
          supportedPlatforms: platforms.length > 0 ? platforms : undefined,
        });
      }

      console.log(`Fetched ${games.length} Game Pass games with metadata`);
      return games;
    } catch (error) {
      console.error('Failed to fetch Game Pass catalog:', error);
      return [];
    }
  }

  private async fetchPSPlusCatalog(): Promise<PSPlusGame[]> {
    const psPlusTitles = [
      "Spider-Man: Miles Morales", "Spider-Man Remastered", "Returnal", "Death Stranding",
      "Ghost of Tsushima Director's Cut", "Demon's Souls", "Ratchet & Clank: Rift Apart",
      "The Last of Us Part II", "God of War", "Horizon Forbidden West", "Horizon Zero Dawn",
      "Uncharted 4: A Thief's End", "Uncharted: The Lost Legacy", "Uncharted: Legacy of Thieves",
      "Bloodborne", "Sekiro: Shadows Die Twice", "Dark Souls III", "Dark Souls Remastered",
      "Elden Ring", "Final Fantasy VII Remake", "Final Fantasy XVI", "Stray",
      "Red Dead Redemption 2", "Grand Theft Auto V", "The Witcher 3: Wild Hunt",
      "Assassin's Creed Valhalla", "Assassin's Creed Odyssey", "Assassin's Creed Origins",
      "Far Cry 6", "Far Cry 5", "Watch Dogs: Legion", "Ghost Recon Breakpoint",
      "Resident Evil Village", "Resident Evil 4", "Resident Evil 2", "Resident Evil 3",
      "Death Stranding Director's Cut", "Metal Gear Solid V: The Phantom Pain",
      "Cyberpunk 2077", "Tales of Arise", "Persona 5 Royal", "Yakuza: Like a Dragon",
      "Yakuza 0", "Judgment", "Lost Judgment", "NBA 2K24", "MLB The Show 24",
      "Soulcalibur VI", "Tekken 7", "Mortal Kombat 11", "Street Fighter 6",
      "Hogwarts Legacy", "Star Wars Jedi: Survivor", "Star Wars Jedi: Fallen Order",
      "Dead Space", "The Callisto Protocol", "Alan Wake 2", "Control",
      "Guardians of the Galaxy", "Gotham Knights", "Batman: Arkham Knight",
      "Days Gone", "Infamous Second Son", "Little Big Planet 3", "Sackboy: A Big Adventure",
      "It Takes Two", "A Way Out", "Overcooked! All You Can Eat", "Fall Guys",
      "Crash Bandicoot N. Sane Trilogy", "Crash Bandicoot 4", "Spyro Reignited Trilogy",
      "Kingdom Hearts III", "NieR: Automata", "NieR Replicant", "Monster Hunter: World",
      "Monster Hunter Rise", "Dragon's Dogma 2", "Devil May Cry 5", "Borderlands 3",
      "Tiny Tina's Wonderlands", "Diablo IV", "Dead Island 2", "Dying Light 2",
      "The Forest", "Sons of the Forest", "Subnautica", "No Man's Sky"
    ];

    console.log(`Using curated PS+ catalog: ${psPlusTitles.length} games`);
    return psPlusTitles.map(title => ({ title }));
  }

  private async fetchGeForceNowCatalog(): Promise<GeForceNowGame[]> {
    const geforceNowTitles = [
      "Cyberpunk 2077", "Hogwarts Legacy", "Baldur's Gate 3", "Diablo IV", "Starfield",
      "Fortnite", "Apex Legends", "Destiny 2", "League of Legends", "Valorant",
      "Counter-Strike 2", "Dota 2", "Path of Exile", "Lost Ark", "New World",
      "The Witcher 3: Wild Hunt", "Red Dead Redemption 2", "Grand Theft Auto V",
      "Elden Ring", "Dark Souls III", "Sekiro: Shadows Die Twice", "Armored Core VI",
      "Assassin's Creed Valhalla", "Assassin's Creed Mirage", "Far Cry 6", "Watch Dogs: Legion",
      "God of War", "A Plague Tale: Requiem", "Control", "Alan Wake 2",
      "Resident Evil Village", "Resident Evil 4", "Dead Space", "The Callisto Protocol",
      "Monster Hunter: World", "Monster Hunter Rise", "Dragon's Dogma 2",
      "Final Fantasy XIV", "Final Fantasy XVI", "Final Fantasy VII Remake",
      "Persona 5 Royal", "Tales of Arise", "NieR: Automata", "NieR Replicant",
      "Dying Light 2", "Dead Island 2", "Days Gone", "Horizon Zero Dawn",
      "Shadow of the Tomb Raider", "Rise of the Tomb Raider", "Tomb Raider",
      "Hitman 3", "Hitman 2", "Hitman", "Sniper Elite 5", "Ghost Recon Breakpoint",
      "Death Stranding", "Metal Gear Solid V", "Devil May Cry 5", "Bayonetta",
      "Disco Elysium", "Divinity: Original Sin 2", "Pillars of Eternity II",
      "Crusader Kings III", "Europa Universalis IV", "Hearts of Iron IV", "Stellaris",
      "Civilization VI", "Humankind", "Age of Empires IV", "Total War: Warhammer III",
      "Cities: Skylines II", "Planet Coaster", "Satisfactory", "Factorio",
      "Stardew Valley", "Terraria", "Valheim", "V Rising", "Core Keeper",
      "No Man's Sky", "Elite Dangerous", "Star Citizen", "Space Engineers",
      "Microsoft Flight Simulator", "Farming Simulator 22", "Euro Truck Simulator 2",
      "Rust", "Ark: Survival Evolved", "DayZ", "The Forest", "Sons of the Forest"
    ];

    console.log(`Using curated GeForce NOW catalog: ${geforceNowTitles.length} games`);
    return geforceNowTitles.map(title => ({ title }));
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
    
    if (!norm1 || !norm2) return false;
    
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
