import { HowLongToBeatService, HowLongToBeatEntry } from 'howlongtobeat';

export interface PlaytimeData {
  mainStoryHours: number | null;
  completionistHours: number | null;
}

class HLTBService {
  private hltb: HowLongToBeatService;

  constructor() {
    this.hltb = new HowLongToBeatService();
  }

  async getPlaytimeForGame(gameName: string): Promise<PlaytimeData> {
    try {
      const results = await this.hltb.search(gameName);
      
      if (!results || results.length === 0) {
        return { mainStoryHours: null, completionistHours: null };
      }

      const bestMatch = results.reduce((best, current) => 
        current.similarity > best.similarity ? current : best
      );

      if (bestMatch.similarity < 0.4) {
        console.log(`Low similarity match for "${gameName}": ${bestMatch.similarity}`);
        return { mainStoryHours: null, completionistHours: null };
      }

      return {
        mainStoryHours: bestMatch.gameplayMain || null,
        completionistHours: bestMatch.gameplayCompletionist || null,
      };
    } catch (error) {
      console.error(`Failed to fetch HLTB data for "${gameName}":`, error);
      return { mainStoryHours: null, completionistHours: null };
    }
  }
}

export const hltbService = new HLTBService();
