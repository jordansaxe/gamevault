import { GameCard } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { Plus, ListPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";

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
  },
  {
    id: "3",
    title: "Starfield",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6qz4.jpg",
    status: "completed" as const,
    metacritic: 83,
    platforms: ["xbox", "pc"],
  },
];

const newReleases = [
  {
    id: "4",
    title: "Alan Wake 2",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6s48.jpg",
    status: "backlog" as const,
    metacritic: 89,
    platforms: ["ps5", "xbox", "pc"],
  },
];

const upcomingGames = [
  {
    id: "5",
    title: "Grand Theft Auto VI",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co87w4.jpg",
    status: "wishlist" as const,
    platforms: ["ps5", "xbox"],
  },
];

const completedGames = [
  {
    id: "3",
    title: "Starfield",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6qz4.jpg",
    status: "completed" as const,
    metacritic: 83,
    platforms: ["xbox", "pc"],
  },
];

export default function Lists() {
  const [location] = useLocation();
  
  const getActiveTab = () => {
    if (location === "/lists/new-releases") return "new-releases";
    if (location === "/lists/upcoming") return "upcoming";
    if (location === "/lists/completed") return "completed";
    return "all";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ListPlus className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-display font-semibold" data-testid="text-lists-title">
              Lists
            </h1>
            <p className="text-muted-foreground mt-1">
              Browse and organize your game collections
            </p>
          </div>
        </div>
        <Button onClick={() => console.log('Create custom list')} data-testid="button-create-custom-list">
          <Plus className="h-4 w-4 mr-2" />
          Create Custom List
        </Button>
      </div>

      <Tabs value={getActiveTab()}>
        <TabsList>
          <TabsTrigger value="all" asChild>
            <a href="/lists/all" data-testid="tab-all-games">Total Games</a>
          </TabsTrigger>
          <TabsTrigger value="new-releases" asChild>
            <a href="/lists/new-releases" data-testid="tab-new-releases">New Releases</a>
          </TabsTrigger>
          <TabsTrigger value="upcoming" asChild>
            <a href="/lists/upcoming" data-testid="tab-upcoming">Upcoming</a>
          </TabsTrigger>
          <TabsTrigger value="completed" asChild>
            <a href="/lists/completed" data-testid="tab-completed">Completed</a>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {allGames.map((game) => (
              <GameCard
                key={game.id}
                {...game}
                onClick={() => console.log('View game:', game.title)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="new-releases" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {newReleases.map((game) => (
              <GameCard
                key={game.id}
                {...game}
                onClick={() => console.log('View game:', game.title)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {upcomingGames.map((game) => (
              <GameCard
                key={game.id}
                {...game}
                onClick={() => console.log('View game:', game.title)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {completedGames.map((game) => (
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
