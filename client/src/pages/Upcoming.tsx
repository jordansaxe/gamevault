import { ReleaseGameCard } from "@/components/ReleaseGameCard";
import { Clock } from "lucide-react";

const upcomingGames: any[] = [];

export default function Upcoming() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-display font-semibold" data-testid="text-upcoming-title">
            Upcoming Games
          </h1>
          <p className="text-muted-foreground mt-1">
            Wishlisted games coming soon
          </p>
        </div>
      </div>

      {upcomingGames.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="empty-upcoming-games">
          <Clock className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Upcoming Games</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Add games to your wishlist to track their upcoming release dates
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingGames.map((game) => (
            <ReleaseGameCard
              key={game.id}
              {...game}
            />
          ))}
        </div>
      )}
    </div>
  );
}
