import { Search, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PlatformIcons } from "./PlatformIcons";
import { MetacriticScore } from "./MetacriticScore";
import { useToast } from "@/hooks/use-toast";

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
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const searchGames = async () => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await apiRequest('POST', '/api/games/search', { query: searchQuery });
        const data = await response.json();
        setResults(data);
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

  const handleAddGame = async (game: SearchResult, status: string) => {
    try {
      await apiRequest('POST', '/api/games', {
        igdbId: game.igdbId,
        name: game.name,
        coverUrl: game.coverUrl,
        releaseDate: game.releaseDate,
        platforms: game.platforms,
        metacriticScore: game.metacriticScore || null,
        summary: game.summary || null,
        genres: game.genres,
        status,
      });

      toast({
        title: "Game added!",
        description: `${game.name} has been added to your ${status}.`,
      });

      queryClient.invalidateQueries({ queryKey: ['/api/games'] });

      setOpen(false);
      setSearchQuery("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add game",
      });
    }
  };

  return (
    <>
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search games..."
          className="pl-9"
          onClick={() => setOpen(true)}
          readOnly
          data-testid="input-game-search"
        />
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search for games..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          data-testid="input-game-search-dialog"
        />
        <CommandList>
          {isSearching && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          
          {!isSearching && searchQuery.length >= 2 && results.length === 0 && (
            <CommandEmpty>No games found.</CommandEmpty>
          )}

          {!isSearching && results.length > 0 && (
            <CommandGroup heading="Search Results">
              {results.map((game) => (
                <CommandItem
                  key={game.igdbId}
                  value={game.name}
                  className="flex items-start gap-3 py-3"
                  data-testid={`search-result-${game.igdbId}`}
                  onSelect={() => handleAddGame(game, 'backlog')}
                >
                  {game.coverUrl && (
                    <img
                      src={game.coverUrl}
                      alt={game.name}
                      className="w-12 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold truncate">{game.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {game.platforms.length > 0 && (
                        <PlatformIcons 
                          platforms={game.platforms.slice(0, 3).map(p => p.toLowerCase())} 
                        />
                      )}
                      {game.metacriticScore > 0 && (
                        <MetacriticScore score={game.metacriticScore} />
                      )}
                    </div>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!isSearching && searchQuery.length < 2 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Type at least 2 characters to search
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
