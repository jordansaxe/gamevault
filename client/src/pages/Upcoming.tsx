import { useQuery, useMutation } from "@tanstack/react-query";
import { ReleaseGameCard } from "@/components/ReleaseGameCard";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw } from "lucide-react";
import { format, differenceInDays, isFuture, isPast } from "date-fns";
import type { Game } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Upcoming() {
  const { toast } = useToast();
  
  const { data: userGames, isLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/games/refresh-release-dates");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      toast({
        title: "Release dates updated",
        description: `Updated ${data.updatedCount} of ${data.totalGames} games`,
      });
    },
    onError: () => {
      toast({
        title: "Failed to refresh",
        description: "Could not update release dates. Please try again.",
        variant: "destructive",
      });
    },
  });

  const upcomingGames = userGames
    ?.filter(game => {
      if (!game.releaseDate) return false;
      const releaseDate = new Date(game.releaseDate);
      return isFuture(releaseDate) || differenceInDays(new Date(), releaseDate) <= 30;
    })
    .map(game => {
      const releaseDate = new Date(game.releaseDate!);
      const daysInfo = Math.abs(differenceInDays(new Date(), releaseDate));
      const isReleased = isPast(releaseDate);
      
      return {
        ...game,
        formattedDate: format(releaseDate, 'MMMM d, yyyy'),
        daysInfo,
        isReleased,
        sortDate: releaseDate.getTime()
      };
    })
    .sort((a, b) => a.sortDate - b.sortDate) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading upcoming games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-display font-semibold" data-testid="text-upcoming-title">
              Upcoming Games
            </h1>
            <p className="text-muted-foreground mt-1">
              Games in your library with upcoming release dates
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={() => refreshMutation.mutate()}
          disabled={refreshMutation.isPending}
          data-testid="button-refresh-dates"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
          {refreshMutation.isPending ? 'Refreshing...' : 'Refresh Dates'}
        </Button>
      </div>

      {upcomingGames.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="empty-upcoming-games">
          <Clock className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Upcoming Games</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Add games to your library to track their upcoming release dates
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingGames.map((game) => (
            <ReleaseGameCard
              key={game.id}
              id={game.id}
              title={game.name}
              coverUrl={game.coverUrl || 'https://via.placeholder.com/100x140?text=No+Cover'}
              releaseDate={game.formattedDate}
              daysInfo={game.daysInfo}
              isReleased={game.isReleased}
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
    </div>
  );
}
