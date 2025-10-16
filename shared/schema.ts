import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  igdbId: integer("igdb_id").notNull(),
  name: text("name").notNull(),
  coverUrl: text("cover_url"),
  releaseDate: timestamp("release_date"),
  platforms: text("platforms").array(),
  metacriticScore: integer("metacritic_score"),
  summary: text("summary"),
  genres: text("genres").array(),
  status: text("status").notNull(),
  addedAt: timestamp("added_at").notNull().default(sql`now()`),
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
  addedAt: true,
}).extend({
  releaseDate: z.coerce.date().nullable().optional(),
});

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;
