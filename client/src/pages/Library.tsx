import { GameCard } from "@/components/GameCard";
import { GameSearchBar } from "@/components/GameSearchBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Game } from "@shared/schema";

export default function Library() {
  const [activeTab, setActiveTab] = useState("all");

  const { data: games = [], isLoading } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });

  const filterGames = (status?: string) => {
    if (!status || status === "all") return games;
    return games.filter((game) => game.status === status);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-semibold" data-testid="text-library-title">
          My Library
        </h1>
        <p className="text-muted-foreground mt-1">
          Browse and manage your game collection
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <GameSearchBar />
        <Button variant="outline" data-testid="button-filters">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">All Games</TabsTrigger>
          <TabsTrigger value="playing" data-testid="tab-playing">Playing</TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed">Completed</TabsTrigger>
          <TabsTrigger value="backlog" data-testid="tab-backlog">Backlog</TabsTrigger>
          <TabsTrigger value="wishlist" data-testid="tab-wishlist">Wishlist</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filterGames(activeTab).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No games in your {activeTab === 'all' ? 'library' : activeTab} yet.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Use the search above to add games!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filterGames(activeTab).map((game) => (
                <GameCard
                  key={game.id}
                  id={game.id}
                  title={game.name}
                  coverUrl={game.coverUrl || 'https://via.placeholder.com/300x400?text=No+Cover'}
                  status={game.status as any}
                  metacritic={game.metacriticScore || undefined}
                  platforms={game.platforms || []}
                  igdbId={game.igdbId}
                  gamePassConsole={game.gamePassConsole || undefined}
                  gamePassPC={game.gamePassPC || undefined}
                  psPlus={game.psPlus || undefined}
                  geforceNow={game.geforceNow || undefined}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
