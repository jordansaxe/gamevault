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

  formatCoverUrl(url: string | undefined, size: 'cover_small' | 'cover_big' | 'screenshot_med' = 'cover_big'): string {
    if (!url) return '';
    return url.replace('t_thumb', `t_${size}`);
  }
}

export const igdbService = new IGDBService();
export type { IGDBGame };
