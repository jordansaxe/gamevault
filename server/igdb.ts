interface TwitchTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface IGDBGame {
  id: number;
  name: string;
  cover?: {
    id: number;
    url: string;
  };
  first_release_date?: number;
  platforms?: Array<{ id: number; name: string }>;
  aggregated_rating?: number;
  rating?: number;
  summary?: string;
  genres?: Array<{ id: number; name: string }>;
}

interface IGDBGameDetail extends IGDBGame {
  screenshots?: Array<{ id: number; url: string }>;
  videos?: Array<{ id: number; video_id: string; name: string }>;
  involved_companies?: Array<{
    id: number;
    company: { id: number; name: string };
    developer: boolean;
    publisher: boolean;
  }>;
  storyline?: string;
  game_modes?: Array<{ id: number; name: string }>;
  player_perspectives?: Array<{ id: number; name: string }>;
  themes?: Array<{ id: number; name: string }>;
  aggregated_rating_count?: number;
  rating_count?: number;
  total_rating?: number;
  total_rating_count?: number;
}

interface IGDBEvent {
  id: number;
  name: string;
  description?: string;
  start_time: number;
  end_time?: number;
  live_stream_url?: string;
  event_logo?: {
    id: number;
    url: string;
  };
  event_networks?: Array<{ id: number; name: string }>;
  games?: Array<{ id: number; name: string }>;
}

class IGDBService {
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.clientId = process.env.TWITCH_CLIENT_ID || '';
    this.clientSecret = process.env.TWITCH_CLIENT_SECRET || '';

    if (!this.clientId || !this.clientSecret) {
      console.error('TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET must be set');
    }
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    const response = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`,
      { method: 'POST' }
    );

    if (!response.ok) {
      throw new Error(`Failed to get Twitch token: ${response.statusText}`);
    }

    const data: TwitchTokenResponse = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;

    return this.accessToken;
  }

  async searchGames(query: string, limit: number = 10): Promise<IGDBGame[]> {
    const token = await this.getAccessToken();

    const body = `
      search "${query}";
      fields name, cover.url, first_release_date, platforms.name, aggregated_rating, rating, summary, genres.name;
      limit ${limit};
    `;

    const response = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': this.clientId,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: body.trim(),
    });

    if (!response.ok) {
      throw new Error(`IGDB API error: ${response.statusText}`);
    }

    const games: IGDBGame[] = await response.json();
    return games;
  }

  async getGameById(id: number): Promise<IGDBGame | null> {
    const token = await this.getAccessToken();

    const body = `
      where id = ${id};
      fields name, cover.url, first_release_date, platforms.name, aggregated_rating, rating, summary, genres.name;
    `;

    const response = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': this.clientId,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: body.trim(),
    });

    if (!response.ok) {
      throw new Error(`IGDB API error: ${response.statusText}`);
    }

    const games: IGDBGame[] = await response.json();
    return games[0] || null;
  }

  async getGameDetails(id: number): Promise<IGDBGameDetail | null> {
    const token = await this.getAccessToken();

    const body = `
      where id = ${id};
      fields name, cover.url, first_release_date, platforms.name, 
             aggregated_rating, rating, summary, genres.name,
             screenshots.url, videos.video_id, videos.name,
             involved_companies.company.name, involved_companies.developer, involved_companies.publisher,
             storyline, game_modes.name, player_perspectives.name, themes.name,
             aggregated_rating_count, rating_count, total_rating, total_rating_count;
    `;

    const response = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': this.clientId,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: body.trim(),
    });

    if (!response.ok) {
      throw new Error(`IGDB API error: ${response.statusText}`);
    }

    const games: IGDBGameDetail[] = await response.json();
    return games[0] || null;
  }

  formatCoverUrl(url: string | undefined, size: 'cover_small' | 'cover_big' | 'screenshot_med' = 'cover_big'): string {
    if (!url) return '';
    return url.replace('t_thumb', `t_${size}`);
  }

  formatScreenshotUrl(url: string | undefined, size: 'screenshot_med' | 'screenshot_big' | '1080p' = 'screenshot_big'): string {
    if (!url) return '';
    return url.replace('t_thumb', `t_${size}`);
  }

  async getUpcomingEvents(limit: number = 20): Promise<IGDBEvent[]> {
    const token = await this.getAccessToken();
    
    const now = Math.floor(Date.now() / 1000);
    
    const body = `
      fields name, description, start_time, end_time, live_stream_url, event_logo.url;
      where start_time != null;
      sort start_time asc;
      limit ${limit};
    `;

    const response = await fetch('https://api.igdb.com/v4/events', {
      method: 'POST',
      headers: {
        'Client-ID': this.clientId,
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: body.trim(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('IGDB Events API error:', errorText);
      return [];
    }

    try {
      const events: IGDBEvent[] = await response.json();
      
      return events
        .filter(event => event.start_time && event.start_time > now)
        .map(event => ({
          ...event,
          event_networks: [],
          games: [],
          start_time: event.start_time - 3600,
          end_time: event.end_time ? event.end_time - 3600 : undefined,
        }));
    } catch (error) {
      console.error('Failed to parse IGDB events:', error);
      return [];
    }
  }
}

export const igdbService = new IGDBService();
export type { IGDBGame, IGDBGameDetail, IGDBEvent };
