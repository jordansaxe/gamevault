import { GameCard } from "@/components/GameCard";
import { GameSearchBar } from "@/components/GameSearchBar";
import { Button } from "@/components/ui/button";
import { Filter, Heart, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Game } from "@shared/schema";

export default function Wishlist() {
  const { data: games = [], isLoading } = useQuery<Game[]>({
    queryKey: ['/api/games', { status: 'wishlist' }],
    queryFn: async () => {
      const res = await fetch('/api/games?status=wishlist');
      if (!res.ok) throw new Error('Failed to fetch wishlist');
      return res.json();
    },
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-display font-semibold" data-testid="text-wishlist-title">
            Wishlist
          </h1>
          <p className="text-muted-foreground mt-1">
            Games you want to play
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <GameSearchBar />
        <Button variant="outline" data-testid="button-filters">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No games in your wishlist yet.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Use the search above to add games!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {games.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              title={game.name}
              coverUrl={game.coverUrl || 'https://via.placeholder.com/300x400?text=No+Cover'}
              status={game.status as any}
              metacritic={game.metacriticScore || undefined}
              platforms={game.platforms || []}
              onClick={() => console.log('View game:', game.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
