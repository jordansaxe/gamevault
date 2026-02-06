import { eq, and, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { type Database } from './db';
import {
  users,
  games,
  subscriptionCatalog,
  type User,
  type UpsertUser,
  type Game,
  type InsertGame,
  type SubscriptionCatalogEntry
} from '@shared/schema';
import type { IStorage } from './storage';

export class SQLStorage implements IStorage {
  constructor(private db: Database) {}

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const id = userData.id || randomUUID();
    const now = new Date();

    const result = await this.db
      .insert(users)
      .values({
        id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: now,
        },
      })
      .returning();

    return result[0];
  }

  // Game operations
  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = randomUUID();

    const result = await this.db
      .insert(games)
      .values({
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
        gamePassConsole: false,
        gamePassPC: false,
        psPlus: false,
        geforceNow: false,
        mainStoryHours: null,
        completionistHours: null,
      })
      .returning();

    return result[0];
  }

  async getGame(id: string): Promise<Game | undefined> {
    const result = await this.db
      .select()
      .from(games)
      .where(eq(games.id, id))
      .limit(1);
    return result[0];
  }

  async getUserGames(userId: string): Promise<Game[]> {
    return this.db
      .select()
      .from(games)
      .where(eq(games.userId, userId));
  }

  async getUserGamesByStatus(userId: string, status: string): Promise<Game[]> {
    return this.db
      .select()
      .from(games)
      .where(and(eq(games.userId, userId), eq(games.status, status)));
  }

  async updateGameStatus(id: string, status: string): Promise<Game | undefined> {
    const result = await this.db
      .update(games)
      .set({ status })
      .where(eq(games.id, id))
      .returning();
    return result[0];
  }

  async deleteGame(id: string): Promise<boolean> {
    const result = await this.db
      .delete(games)
      .where(eq(games.id, id))
      .returning({ id: games.id });
    return result.length > 0;
  }

  async findUserGameByIgdbId(userId: string, igdbId: number): Promise<Game | undefined> {
    const result = await this.db
      .select()
      .from(games)
      .where(and(eq(games.userId, userId), eq(games.igdbId, igdbId)))
      .limit(1);
    return result[0];
  }

  // Subscription service operations
  async getAllGamesForSubscriptionUpdate(): Promise<Array<{ igdbId: number; name: string }>> {
    const result = await this.db
      .selectDistinct({ igdbId: games.igdbId, name: games.name })
      .from(games);
    return result;
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
    const updateData: Record<string, boolean> = {};

    if (subscriptions.gamePassConsole !== undefined) {
      updateData.gamePassConsole = subscriptions.gamePassConsole;
    }
    if (subscriptions.gamePassPC !== undefined) {
      updateData.gamePassPC = subscriptions.gamePassPC;
    }
    if (subscriptions.psPlus !== undefined) {
      updateData.psPlus = subscriptions.psPlus;
    }
    if (subscriptions.geforceNow !== undefined) {
      updateData.geforceNow = subscriptions.geforceNow;
    }

    if (Object.keys(updateData).length > 0) {
      await this.db
        .update(games)
        .set(updateData)
        .where(eq(games.igdbId, igdbId));
    }
  }

  // HowLongToBeat operations
  async updateGamePlaytime(
    igdbId: number,
    mainStoryHours: number | null,
    completionistHours: number | null
  ): Promise<void> {
    await this.db
      .update(games)
      .set({ mainStoryHours, completionistHours })
      .where(eq(games.igdbId, igdbId));
  }

  // Release date operations
  async updateGameReleaseDate(igdbId: number, releaseDate: Date | null): Promise<void> {
    await this.db
      .update(games)
      .set({ releaseDate })
      .where(eq(games.igdbId, igdbId));
  }

  async getAllGamesWithIgdbIds(): Promise<Array<{ id: string; igdbId: number; name: string }>> {
    const result = await this.db
      .selectDistinctOn([games.igdbId], {
        id: games.id,
        igdbId: games.igdbId,
        name: games.name
      })
      .from(games);
    return result;
  }

  // Subscription catalog operations
  async upsertSubscriptionCatalogEntry(entry: {
    igdbId: number;
    name: string;
    gamePassConsole?: boolean;
    gamePassPC?: boolean;
    psPlus?: boolean;
    geforceNow?: boolean;
  }): Promise<void> {
    await this.db
      .insert(subscriptionCatalog)
      .values({
        igdbId: entry.igdbId,
        name: entry.name,
        gamePassConsole: entry.gamePassConsole ?? false,
        gamePassPC: entry.gamePassPC ?? false,
        psPlus: entry.psPlus ?? false,
        geforceNow: entry.geforceNow ?? false,
        lastUpdated: new Date(),
      })
      .onConflictDoUpdate({
        target: subscriptionCatalog.igdbId,
        set: {
          name: entry.name,
          gamePassConsole: entry.gamePassConsole ?? false,
          gamePassPC: entry.gamePassPC ?? false,
          psPlus: entry.psPlus ?? false,
          geforceNow: entry.geforceNow ?? false,
          lastUpdated: new Date(),
        },
      });
  }

  async getSubscriptionCatalogEntry(igdbId: number): Promise<SubscriptionCatalogEntry | undefined> {
    const result = await this.db
      .select()
      .from(subscriptionCatalog)
      .where(eq(subscriptionCatalog.igdbId, igdbId))
      .limit(1);
    return result[0];
  }

  async clearSubscriptionCatalog(): Promise<void> {
    await this.db.delete(subscriptionCatalog);
  }
}
