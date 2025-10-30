import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  igdbId: integer("igdb_id").notNull(),
  name: text("name").notNull(),
  coverUrl: text("cover_url"),
  releaseDate: timestamp("release_date"),
  platforms: text("platforms").array(),
  platform: text("platform"),
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
