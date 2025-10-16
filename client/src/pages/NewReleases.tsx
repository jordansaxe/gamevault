import { ReleaseGameCard } from "@/components/ReleaseGameCard";
import { Sparkles } from "lucide-react";

const newReleases: any[] = [];

export default function NewReleases() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-display font-semibold" data-testid="text-new-releases-title">
            New Releases
          </h1>
          <p className="text-muted-foreground mt-1">
            Wishlisted games that have recently released
          </p>
        </div>
      </div>

      {newReleases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="empty-new-releases">
          <Sparkles className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No New Releases</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            When games from your wishlist are released, they'll appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newReleases.map((game) => (
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
