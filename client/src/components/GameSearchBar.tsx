import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { PlatformIcons } from "./PlatformIcons";
import { MetacriticScore } from "./MetacriticScore";
import { useLocation } from "wouter";

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

export function GameSearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [, setLocation] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const searchGames = async () => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch('/api/games/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery }),
        });
        const data = await response.json();
        setResults(data.slice(0, 5));
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchGames, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGameClick = (igdbId: number) => {
    setShowDropdown(false);
    setSearchQuery("");
    setLocation(`/game/${igdbId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.length >= 2) {
      setShowDropdown(false);
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative flex-1 max-w-xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search games..."
        className="pl-9"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={handleKeyDown}
        data-testid="input-search"
      />

      {showDropdown && searchQuery.length >= 2 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 max-h-[400px] overflow-y-auto"
        >
          {isSearching && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isSearching && results.length === 0 && (
            <div className="py-6 text-center text-muted-foreground">
              No games found
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="py-2">
              {results.map((game) => (
                <div
                  key={game.igdbId}
                  className="flex items-start gap-3 px-3 py-2 hover-elevate cursor-pointer"
                  onClick={() => handleGameClick(game.igdbId)}
                  data-testid={`search-result-${game.igdbId}`}
                >
                  {game.coverUrl && (
                    <img
                      src={game.coverUrl}
                      alt={game.name}
                      className="w-10 h-14 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold truncate text-sm">{game.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {game.platforms.length > 0 && (
                        <PlatformIcons 
                          platforms={game.platforms.slice(0, 3)} 
                        />
                      )}
                      {game.metacriticScore > 0 && (
                        <MetacriticScore score={game.metacriticScore} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div 
                className="px-3 py-2 text-center text-sm text-muted-foreground border-t hover:bg-accent cursor-pointer"
                onClick={() => {
                  setShowDropdown(false);
                  setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
                  setSearchQuery("");
                }}
              >
                Press Enter to see all results
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
