import initSqlJs, { Database } from "sql.js";
import { igdbService } from "./igdb";
import { storage } from "./storage";

// Supported import formats
export type ImportFormat = "gametrack" | "gamery" | "auto";

export interface ImportedGame {
  name: string;
  platform?: string;
  status: string;
  releaseDate?: Date | null;
  notes?: string;
}

export interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  failed: number;
  games: Array<{
    name: string;
    status: "imported" | "duplicate" | "not_found" | "error";
    message?: string;
    igdbId?: number;
  }>;
}

// Status mapping for different apps
const STATUS_MAP: Record<string, Record<string, string>> = {
  gametrack: {
    playing: "playing",
    completed: "completed",
    backlog: "backlog",
    wishlist: "wishlist",
    dropped: "dropped",
    "on hold": "backlog",
    "not started": "backlog",
  },
  gamery: {
    in_progress: "playing",
    playing: "playing",
    finished: "completed",
    completed: "completed",
    to_play: "backlog",
    backlog: "backlog",
    want: "wishlist",
    wishlist: "wishlist",
    abandoned: "dropped",
    dropped: "dropped",
  },
};

// Normalize status to GameVault format
function normalizeStatus(status: string, format: ImportFormat): string {
  const normalizedInput = status.toLowerCase().trim();

  // Try format-specific mapping first
  if (format !== "auto" && STATUS_MAP[format]) {
    const mapped = STATUS_MAP[format][normalizedInput];
    if (mapped) return mapped;
  }

  // Try all mappings
  for (const formatMap of Object.values(STATUS_MAP)) {
    const mapped = formatMap[normalizedInput];
    if (mapped) return mapped;
  }

  // Default to backlog if unknown
  return "backlog";
}

// Normalize game title for comparison
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
}

// Calculate string similarity (Levenshtein-based)
function similarity(str1: string, str2: string): number {
  const s1 = normalizeTitle(str1);
  const s2 = normalizeTitle(str2);

  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;

  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  // Check if one contains the other
  if (longer.includes(shorter)) {
    return shorter.length / longer.length;
  }

  // Levenshtein distance
  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }

  return (longer.length - costs[s2.length]) / longer.length;
}

class ImportService {
  private SQL: any = null;

  async initialize(): Promise<void> {
    if (!this.SQL) {
      this.SQL = await initSqlJs();
    }
  }

  // Parse SQLite file and extract games
  async parseFile(
    buffer: ArrayBuffer,
    format: ImportFormat
  ): Promise<ImportedGame[]> {
    await this.initialize();

    const db = new this.SQL.Database(new Uint8Array(buffer));
    let games: ImportedGame[] = [];

    try {
      // Get table names to detect format
      const tables = db.exec(
        "SELECT name FROM sqlite_master WHERE type='table'"
      );
      const tableNames =
        tables[0]?.values.map((row: any[]) => row[0].toLowerCase()) || [];

      console.log("Found tables:", tableNames);

      // Try to detect format and parse accordingly
      if (format === "gametrack" || this.isGameTrack(tableNames)) {
        games = this.parseGameTrack(db);
      } else if (format === "gamery" || this.isGamery(tableNames)) {
        games = this.parseGamery(db);
      } else {
        // Try generic parsing
        games = this.parseGeneric(db, tableNames);
      }
    } finally {
      db.close();
    }

    return games;
  }

  private isGameTrack(tableNames: string[]): boolean {
    return (
      tableNames.includes("zgame") ||
      tableNames.includes("zplatform") ||
      tableNames.includes("z_primarykey")
    );
  }

  private isGamery(tableNames: string[]): boolean {
    return tableNames.includes("games") || tableNames.includes("game");
  }

  private parseGameTrack(db: Database): ImportedGame[] {
    const games: ImportedGame[] = [];

    try {
      // GameTrack uses Core Data format with Z prefixed tables
      const result = db.exec(`
        SELECT
          ZTITLE as name,
          ZPLATFORM as platform,
          ZSTATUS as status
        FROM ZGAME
        WHERE ZTITLE IS NOT NULL
      `);

      if (result[0]?.values) {
        for (const row of result[0].values) {
          games.push({
            name: String(row[0] || ""),
            platform: row[1] ? String(row[1]) : undefined,
            status: row[2] ? String(row[2]) : "backlog",
          });
        }
      }
    } catch (error) {
      console.log("GameTrack parsing failed, trying alternative schema:", error);
      // Try alternative column names
      try {
        const result = db.exec(`
          SELECT * FROM ZGAME LIMIT 1
        `);
        console.log("ZGAME columns:", result[0]?.columns);
      } catch (e) {
        console.log("Could not read ZGAME table");
      }
    }

    return games;
  }

  private parseGamery(db: Database): ImportedGame[] {
    const games: ImportedGame[] = [];

    try {
      // Try common Gamery schema
      const result = db.exec(`
        SELECT
          name,
          platform,
          status,
          release_date
        FROM games
        WHERE name IS NOT NULL
      `);

      if (result[0]?.values) {
        for (const row of result[0].values) {
          games.push({
            name: String(row[0] || ""),
            platform: row[1] ? String(row[1]) : undefined,
            status: row[2] ? String(row[2]) : "backlog",
            releaseDate: row[3] ? new Date(String(row[3])) : null,
          });
        }
      }
    } catch (error) {
      console.log("Gamery parsing failed, trying alternative schema:", error);
    }

    return games;
  }

  private parseGeneric(db: Database, tableNames: string[]): ImportedGame[] {
    const games: ImportedGame[] = [];

    // Try to find a games table
    const possibleTables = ["games", "game", "library", "collection", "zgame"];
    const gameTable = possibleTables.find((t) => tableNames.includes(t));

    if (!gameTable) {
      console.log("No recognized game table found");
      return games;
    }

    try {
      // Get column names
      const pragma = db.exec(`PRAGMA table_info(${gameTable})`);
      const columns = pragma[0]?.values.map((row: any[]) =>
        String(row[1]).toLowerCase()
      ) || [];

      console.log(`Columns in ${gameTable}:`, columns);

      // Find name column
      const nameCol =
        columns.find((c: string) =>
          ["name", "title", "ztitle", "game_name"].includes(c)
        ) || columns[0];
      const statusCol = columns.find((c: string) =>
        ["status", "zstatus", "state", "completion"].includes(c)
      );
      const platformCol = columns.find((c: string) =>
        ["platform", "zplatform", "console", "system"].includes(c)
      );

      if (!nameCol) {
        console.log("Could not find name column");
        return games;
      }

      // Build query
      const selectCols = [nameCol];
      if (statusCol) selectCols.push(statusCol);
      if (platformCol) selectCols.push(platformCol);

      const result = db.exec(
        `SELECT ${selectCols.join(", ")} FROM ${gameTable} WHERE ${nameCol} IS NOT NULL`
      );

      if (result[0]?.values) {
        for (const row of result[0].values) {
          games.push({
            name: String(row[0] || ""),
            status: statusCol && row[1] ? String(row[1]) : "backlog",
            platform: platformCol && row[2] ? String(row[2]) : undefined,
          });
        }
      }
    } catch (error) {
      console.log("Generic parsing failed:", error);
    }

    return games;
  }

  // Match game to IGDB and create in storage
  async importGames(
    userId: string,
    games: ImportedGame[],
    format: ImportFormat
  ): Promise<ImportResult> {
    const result: ImportResult = {
      total: games.length,
      imported: 0,
      skipped: 0,
      failed: 0,
      games: [],
    };

    for (const game of games) {
      if (!game.name || game.name.trim() === "") {
        result.failed++;
        result.games.push({
          name: "(empty)",
          status: "error",
          message: "Empty game name",
        });
        continue;
      }

      try {
        // Search IGDB for the game
        const searchResults = await igdbService.searchGames(game.name, 5);

        if (!searchResults || searchResults.length === 0) {
          result.failed++;
          result.games.push({
            name: game.name,
            status: "not_found",
            message: "No match found in IGDB",
          });
          continue;
        }

        // Find best match using similarity
        let bestMatch = searchResults[0];
        let bestScore = similarity(game.name, bestMatch.name);

        for (const candidate of searchResults.slice(1)) {
          const score = similarity(game.name, candidate.name);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = candidate;
          }
        }

        // Require minimum similarity threshold
        if (bestScore < 0.5) {
          result.failed++;
          result.games.push({
            name: game.name,
            status: "not_found",
            message: `Best match "${bestMatch.name}" has low similarity (${Math.round(bestScore * 100)}%)`,
          });
          continue;
        }

        // Check for duplicate
        const existingGame = await storage.findUserGameByIgdbId(
          userId,
          bestMatch.id
        );
        if (existingGame) {
          result.skipped++;
          result.games.push({
            name: game.name,
            status: "duplicate",
            message: `Already in library as "${existingGame.name}"`,
            igdbId: bestMatch.id,
          });
          continue;
        }

        // Normalize status
        const normalizedStatus = normalizeStatus(game.status, format);

        // Create game in storage
        await storage.createGame({
          userId,
          igdbId: bestMatch.id,
          name: bestMatch.name,
          coverUrl: igdbService.formatCoverUrl(bestMatch.cover?.url) || null,
          releaseDate: bestMatch.first_release_date
            ? new Date(bestMatch.first_release_date * 1000)
            : null,
          platforms: bestMatch.platforms?.map((p: any) => p.name) || null,
          platform: game.platform || null,
          metacriticScore: Math.round(
            bestMatch.aggregated_rating || bestMatch.rating || 0
          ) || null,
          summary: bestMatch.summary || null,
          genres: bestMatch.genres?.map((g: any) => g.name) || null,
          status: normalizedStatus,
        });

        result.imported++;
        result.games.push({
          name: game.name,
          status: "imported",
          message: `Matched to "${bestMatch.name}" (${Math.round(bestScore * 100)}% match)`,
          igdbId: bestMatch.id,
        });

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Error importing ${game.name}:`, error);
        result.failed++;
        result.games.push({
          name: game.name,
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return result;
  }

  // Get list of supported formats
  getSupportedFormats(): Array<{ id: ImportFormat; name: string; description: string }> {
    return [
      {
        id: "gametrack",
        name: "GameTrack",
        description: "iOS app for tracking games (GameTrack.app)",
      },
      {
        id: "gamery",
        name: "Gamery",
        description: "iOS game collection tracker",
      },
      {
        id: "auto",
        name: "Auto-detect",
        description: "Automatically detect the file format",
      },
    ];
  }
}

export const importService = new ImportService();
