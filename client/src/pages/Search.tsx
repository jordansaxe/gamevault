import { useEffect, useState } from "react";
import { useSearch, useLocation } from "wouter";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GameCard } from "@/components/GameCard";

interface SearchResult {
  igdbId: number;
  name: string;
  coverUrl: string | null;
  releaseDate: Date | null;
  platforms: string[];
  metacriticScore: number;
  summary: string;
  genres: string[];
}

export default function Search() {
  const searchParams = useSearch();
  const [, setLocation] = useLocation();
  const urlQuery = new URLSearchParams(searchParams).get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    setSearchQuery(urlQuery);
    if (urlQuery.length >= 2) {
      performSearch(urlQuery);
    }
  }, [urlQuery]);

  const performSearch = async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    try {
      const response = await fetch('/api/games/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.length >= 2) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
      performSearch(searchQuery);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-outfit font-bold" data-testid="text-search-title">
          Search Games
        </h1>
        <p className="text-muted-foreground">
          Find games from IGDB's extensive database
        </p>
      </div>

      <div className="relative max-w-xl">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for games... (press Enter to search)"
          className="pl-9"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoFocus
          data-testid="input-search-page"
        />
      </div>

      {isSearching && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isSearching && hasSearched && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No games found for "{urlQuery}"</p>
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Found {results.length} result{results.length !== 1 ? 's' : ''} for "{urlQuery}"
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((game) => (
              <GameCard
                key={game.igdbId}
                id={String(game.igdbId)}
                igdbId={game.igdbId}
                title={game.name}
                coverUrl={game.coverUrl || 'https://via.placeholder.com/264x352?text=No+Cover'}
                platforms={game.platforms}
                metacritic={game.metacriticScore}
              />
            ))}
          </div>
        </div>
      )}

      {!hasSearched && (
        <div className="text-center py-12">
          <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Type a game name and press Enter to search</p>
        </div>
      )}
    </div>
  );
}
