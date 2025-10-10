import { GameCard } from "@/components/GameCard";
import { GameSearchBar } from "@/components/GameSearchBar";
import { Button } from "@/components/ui/button";
import { Filter, Heart } from "lucide-react";

//todo: remove mock functionality
const wishlistGames = [
  {
    id: "1",
    title: "Grand Theft Auto VI",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co87w4.jpg",
    status: "wishlist" as const,
    platforms: ["ps5", "xbox"],
  },
  {
    id: "2",
    title: "Hollow Knight: Silksong",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2m7r.jpg",
    status: "wishlist" as const,
    platforms: ["switch", "pc"],
  },
  {
    id: "3",
    title: "Fable",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6mz4.jpg",
    status: "wishlist" as const,
    platforms: ["xbox", "pc"],
  },
  {
    id: "4",
    title: "Baldur's Gate 3",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5vb3.jpg",
    status: "wishlist" as const,
    metacritic: 96,
    platforms: ["ps5", "pc"],
  },
  {
    id: "5",
    title: "Spider-Man 2",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6qz1.jpg",
    status: "wishlist" as const,
    metacritic: 90,
    platforms: ["ps5"],
  },
];

export default function Wishlist() {
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {wishlistGames.map((game) => (
          <GameCard
            key={game.id}
            {...game}
            onClick={() => console.log('View game:', game.title)}
          />
        ))}
      </div>
    </div>
  );
}
