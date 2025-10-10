import { DashboardStats } from "@/components/DashboardStats";
import { GameCard } from "@/components/GameCard";
import { EventCard } from "@/components/EventCard";
import { ServiceBadge } from "@/components/ServiceBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

//todo: remove mock functionality
const recentGames = [
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
];

const upcomingEvents = [
  {
    id: "1",
    name: "Summer Game Fest 2025",
    date: "June 8, 2025",
    description: "The biggest gaming announcements of the summer",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop",
    gameCount: 42,
  },
  {
    id: "2",
    name: "State of Play",
    date: "May 15, 2025",
    description: "PlayStation's showcase of upcoming titles",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
    gameCount: 18,
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-semibold" data-testid="text-dashboard-title">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your gaming library and discover new titles
        </p>
      </div>

      <DashboardStats
        totalGames={156}
        completedGames={42}
        hoursPlayed={328}
        wishlistCount={89}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="font-display">New to Streaming Services</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Recently added to your subscriptions
            </p>
          </div>
          <Sparkles className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.igdb.com/igdb/image/upload/t_cover_small/co5vb3.jpg"
                  alt="Baldur's Gate 3"
                  className="h-12 w-9 rounded object-cover"
                />
                <div>
                  <p className="font-medium text-sm">Baldur's Gate 3</p>
                  <p className="text-xs text-muted-foreground">Added 2 days ago</p>
                </div>
              </div>
              <ServiceBadge service="game-pass" tier="PC" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.igdb.com/igdb/image/upload/t_cover_small/co6qz1.jpg"
                  alt="Spider-Man 2"
                  className="h-12 w-9 rounded object-cover"
                />
                <div>
                  <p className="font-medium text-sm">Spider-Man 2</p>
                  <p className="text-xs text-muted-foreground">Added 5 days ago</p>
                </div>
              </div>
              <ServiceBadge service="ps-plus" tier="Extra" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold">Recently Added</h2>
          <Button variant="ghost" size="sm" data-testid="button-view-all-games">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recentGames.map((game) => (
            <GameCard
              key={game.id}
              {...game}
              onClick={() => console.log('View game:', game.title)}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold">Upcoming Events</h2>
          <Button variant="ghost" size="sm" data-testid="button-view-all-events">
            View Calendar
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </div>
  );
}
