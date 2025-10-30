import { type User, type UpsertUser, type Game, type InsertGame } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  createGame(game: InsertGame): Promise<Game>;
  getGame(id: string): Promise<Game | undefined>;
  getUserGames(userId: string): Promise<Game[]>;
  getUserGamesByStatus(userId: string, status: string): Promise<Game[]>;
  updateGameStatus(id: string, status: string): Promise<Game | undefined>;
  deleteGame(id: string): Promise<boolean>;
  findUserGameByIgdbId(userId: string, igdbId: number): Promise<Game | undefined>;
  
  // Subscription service operations
  getAllGamesForSubscriptionUpdate(): Promise<Array<{ igdbId: number; name: string }>>;
  updateGameSubscriptions(
    igdbId: number,
    subscriptions: {
      gamePassConsole?: boolean;
      gamePassPC?: boolean;
      psPlus?: boolean;
      geforceNow?: boolean;
    }
  ): Promise<void>;
  
  // HowLongToBeat operations
  updateGamePlaytime(igdbId: number, mainStoryHours: number | null, completionistHours: number | null): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private games: Map<string, Game>;

  constructor() {
    this.users = new Map();
    this.games = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id!);
    const now = new Date();
    
    const user: User = existingUser 
      ? { 
          ...existingUser, 
          ...userData,
          updatedAt: now,
        } as User
      : { 
          id: userData.id || randomUUID(),
          email: userData.email || null,
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          profileImageUrl: userData.profileImageUrl || null,
          createdAt: now,
          updatedAt: now,
        };
    
    this.users.set(user.id, user);
    return user;
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = randomUUID();
    const game: Game = { 
      id,
      userId: insertGame.userId,
      igdbId: insertGame.igdbId,
      name: insertGame.name,
      coverUrl: insertGame.coverUrl ?? null,
      releaseDate: insertGame.releaseDate ?? null,
      platforms: insertGame.platforms ?? null,
      platform: insertGame.platform ?? null,
      metacriticScore: insertGame.metacriticScore ?? null,
      summary: insertGame.summary ?? null,
      genres: insertGame.genres ?? null,
      status: insertGame.status,
      addedAt: new Date(),
      gamePassConsole: false,
      gamePassPC: false,
      psPlus: false,
      geforceNow: false,
      mainStoryHours: null,
      completionistHours: null,
    };
    this.games.set(id, game);
    return game;
  }

  async getGame(id: string): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async getUserGames(userId: string): Promise<Game[]> {
    return Array.from(this.games.values()).filter(
      (game) => game.userId === userId,
    );
  }

  async getUserGamesByStatus(userId: string, status: string): Promise<Game[]> {
    return Array.from(this.games.values()).filter(
      (game) => game.userId === userId && game.status === status,
    );
  }

  async updateGameStatus(id: string, status: string): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;
    
    const updatedGame = { ...game, status };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  async deleteGame(id: string): Promise<boolean> {
    return this.games.delete(id);
  }

  async findUserGameByIgdbId(userId: string, igdbId: number): Promise<Game | undefined> {
    return Array.from(this.games.values()).find(
      (game) => game.userId === userId && game.igdbId === igdbId,
    );
  }

  async getAllGamesForSubscriptionUpdate(): Promise<Array<{ igdbId: number; name: string }>> {
    const uniqueGames = new Map<number, string>();
    
    for (const game of Array.from(this.games.values())) {
      if (!uniqueGames.has(game.igdbId)) {
        uniqueGames.set(game.igdbId, game.name);
      }
    }
    
    return Array.from(uniqueGames.entries()).map(([igdbId, name]) => ({ igdbId, name }));
  }

  async updateGameSubscriptions(
    igdbId: number,
    subscriptions: {
      gamePassConsole?: boolean;
      gamePassPC?: boolean;
      psPlus?: boolean;
      geforceNow?: boolean;
    }
  ): Promise<void> {
    for (const [id, game] of Array.from(this.games.entries())) {
      if (game.igdbId === igdbId) {
        this.games.set(id, {
          ...game,
          gamePassConsole: subscriptions.gamePassConsole ?? game.gamePassConsole,
          gamePassPC: subscriptions.gamePassPC ?? game.gamePassPC,
          psPlus: subscriptions.psPlus ?? game.psPlus,
          geforceNow: subscriptions.geforceNow ?? game.geforceNow,
        });
      }
    }
  }

  async updateGamePlaytime(igdbId: number, mainStoryHours: number | null, completionistHours: number | null): Promise<void> {
    for (const [id, game] of Array.from(this.games.entries())) {
      if (game.igdbId === igdbId) {
        this.games.set(id, {
          ...game,
          mainStoryHours,
          completionistHours,
        });
      }
    }
  }
}

export const storage = new MemStorage();
