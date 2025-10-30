import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { igdbService } from "./igdb";
import { insertGameSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { hltbService } from "./hltbService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app.post("/api/games/search", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const games = await igdbService.searchGames(query, 10);
      
      const formattedGames = games.map(game => ({
        igdbId: game.id,
        name: game.name,
        coverUrl: igdbService.formatCoverUrl(game.cover?.url),
        releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000) : null,
        platforms: game.platforms?.map(p => p.name) || [],
        metacriticScore: Math.round(game.aggregated_rating || game.rating || 0),
        summary: game.summary || '',
        genres: game.genres?.map(g => g.name) || [],
      }));

      res.json(formattedGames);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Failed to search games' });
    }
  });

  app.post("/api/games", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const gameData = insertGameSchema.parse({
        ...req.body,
        userId,
      });

      const existingGame = await storage.findUserGameByIgdbId(userId, gameData.igdbId);
      
      if (existingGame) {
        return res.status(400).json({ error: 'Game already in your collection' });
      }

      const game = await storage.createGame(gameData);
      res.json(game);
    } catch (error) {
      console.error('Add game error:', error);
      res.status(500).json({ error: 'Failed to add game' });
    }
  });

  app.get("/api/games", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const status = req.query.status as string | undefined;

      const games = status 
        ? await storage.getUserGamesByStatus(userId, status)
        : await storage.getUserGames(userId);

      res.json(games);
    } catch (error) {
      console.error('Get games error:', error);
      res.status(500).json({ error: 'Failed to get games' });
    }
  });

  app.patch("/api/games/:id/status", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || typeof status !== 'string') {
        return res.status(400).json({ error: 'Status is required' });
      }

      const game = await storage.updateGameStatus(id, status);
      
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      res.json(game);
    } catch (error) {
      console.error('Update game error:', error);
      res.status(500).json({ error: 'Failed to update game' });
    }
  });

  app.delete("/api/games/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteGame(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Game not found' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Delete game error:', error);
      res.status(500).json({ error: 'Failed to delete game' });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const events = await igdbService.getUpcomingEvents(50);
      
      const formattedEvents = events.map(event => ({
        id: event.id,
        name: event.name,
        description: event.description || '',
        startTime: new Date(event.start_time * 1000),
        endTime: event.end_time ? new Date(event.end_time * 1000) : null,
        liveStreamUrl: event.live_stream_url || null,
        logoUrl: igdbService.formatCoverUrl(event.event_logo?.url, 'cover_big'),
        networks: event.event_networks?.map(n => n.name) || [],
        games: event.games?.map(g => g.name) || [],
      }));

      res.json(formattedEvents);
    } catch (error) {
      console.error('Events fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

  app.get("/api/games/igdb/:igdbId", async (req, res) => {
    try {
      const igdbId = parseInt(req.params.igdbId);
      
      if (isNaN(igdbId)) {
        return res.status(400).json({ error: 'Invalid game ID' });
      }

      const game = await igdbService.getGameDetails(igdbId);
      
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      const developers = game.involved_companies
        ?.filter(ic => ic.developer)
        .map(ic => ic.company.name) || [];
      
      const publishers = game.involved_companies
        ?.filter(ic => ic.publisher)
        .map(ic => ic.company.name) || [];

      const formattedGame = {
        igdbId: game.id,
        name: game.name,
        coverUrl: igdbService.formatCoverUrl(game.cover?.url),
        releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000) : null,
        platforms: game.platforms?.map(p => p.name) || [],
        metacriticScore: Math.round(game.aggregated_rating || game.rating || 0),
        summary: game.summary || '',
        storyline: game.storyline || '',
        genres: game.genres?.map(g => g.name) || [],
        developers,
        publishers,
        screenshots: game.screenshots?.map(s => igdbService.formatScreenshotUrl(s.url)) || [],
        videos: game.videos || [],
        gameModes: game.game_modes?.map(m => m.name) || [],
        playerPerspectives: game.player_perspectives?.map(p => p.name) || [],
        themes: game.themes?.map(t => t.name) || [],
        ratingCount: game.aggregated_rating_count || game.rating_count || 0,
      };

      res.json(formattedGame);
    } catch (error) {
      console.error('Get game details error:', error);
      res.status(500).json({ error: 'Failed to get game details' });
    }
  });

  app.get("/api/games/:igdbId/playtime", async (req, res) => {
    try {
      const igdbId = parseInt(req.params.igdbId);
      
      if (isNaN(igdbId)) {
        return res.status(400).json({ error: 'Invalid game ID' });
      }

      const gameDetails = await igdbService.getGameDetails(igdbId);
      
      if (!gameDetails) {
        return res.status(404).json({ error: 'Game not found' });
      }

      const playtimeData = await hltbService.getPlaytimeForGame(gameDetails.name);
      
      await storage.updateGamePlaytime(igdbId, playtimeData.mainStoryHours, playtimeData.completionistHours);

      res.json(playtimeData);
    } catch (error) {
      console.error('Get playtime error:', error);
      res.status(500).json({ error: 'Failed to get playtime data' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
