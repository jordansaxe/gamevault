import { GameCard } from "@/components/GameCard";
import { GameSearchBar } from "@/components/GameSearchBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
import { useState } from "react";

//todo: remove mock functionality
const allGames = [
  {
    id: "1",
    title: "Baldur's Gate 3",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5vb3.jpg",
    status: "playing" as const,
    metacritic: 96,
    platforms: ["ps5", "pc"],
  },
  {
    id: "2",
    title: "Spider-Man 2",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6qz1.jpg",
    status: "backlog" as const,
    metacritic: 90,
    platforms: ["ps5"],
    services: [{ service: "ps-plus" as const, tier: "Extra" }],
  },
  {
    id: "3",
    title: "Starfield",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6qz4.jpg",
    status: "completed" as const,
    metacritic: 83,
    platforms: ["xbox", "pc"],
    services: [{ service: "game-pass" as const, tier: "Ultimate" }],
  },
  {
    id: "4",
    title: "The Last of Us Part II",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2gvu.jpg",
    status: "completed" as const,
    metacritic: 93,
    platforms: ["ps5", "ps4"],
  },
  {
    id: "5",
    title: "Zelda: Tears of the Kingdom",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.jpg",
    status: "wishlist" as const,
    metacritic: 96,
    platforms: ["switch"],
  },
  {
    id: "6",
    title: "Hogwarts Legacy",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6nq7.jpg",
    status: "playing" as const,
    metacritic: 84,
    platforms: ["ps5", "xbox", "pc"],
  },
  {
    id: "7",
    title: "Resident Evil 4",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6pjr.jpg",
    status: "backlog" as const,
    metacritic: 93,
    platforms: ["ps5", "xbox", "pc"],
  },
  {
    id: "8",
    title: "God of War Ragnarök",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg",
    status: "completed" as const,
    metacritic: 94,
    platforms: ["ps5", "ps4"],
  },
];

export default function Library() {
  const [activeTab, setActiveTab] = useState("all");

  const filterGames = (status?: string) => {
    if (!status || status === "all") return allGames;
    return allGames.filter((game) => game.status === status);
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filterGames(activeTab).map((game) => (
              <GameCard
                key={game.id}
                {...game}
                onClick={() => console.log('View game:', game.title)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
