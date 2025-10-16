import { GameCard } from "@/components/GameCard";
import { ServiceBadge } from "@/components/ServiceBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

//todo: remove mock functionality
const serviceCatalog = {
  "game-pass": [
    {
      id: "1",
      title: "Starfield",
      coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6qz4.jpg",
      metacritic: 83,
      platforms: ["xbox", "pc"],
      services: [{ service: "game-pass" as const, tier: "Ultimate" }],
    },
    {
      id: "2",
      title: "Baldur's Gate 3",
      coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5vb3.jpg",
      metacritic: 96,
      platforms: ["xbox", "pc"],
      services: [{ service: "game-pass" as const, tier: "PC" }],
    },
  ],
  "ps-plus": [
    {
      id: "3",
      title: "Spider-Man 2",
      coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6qz1.jpg",
      metacritic: 90,
      platforms: ["ps5"],
      services: [{ service: "ps-plus" as const, tier: "Extra" }],
    },
    {
      id: "4",
      title: "Ghost of Tsushima",
      coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyi.jpg",
      metacritic: 83,
      platforms: ["ps5", "ps4"],
      services: [{ service: "ps-plus" as const, tier: "Extra" }],
    },
  ],
};

export default function StreamingServices() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-semibold" data-testid="text-services-title">
          Subscription Services
        </h1>
        <p className="text-muted-foreground mt-1">
          Browse games available on your subscriptions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="space-y-1">
            <ServiceBadge service="game-pass" />
            <CardTitle className="text-lg">Xbox Game Pass</CardTitle>
            <CardDescription>450+ games available</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Access to day-one releases and Xbox exclusives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <ServiceBadge service="ps-plus" />
            <CardTitle className="text-lg">PlayStation Plus</CardTitle>
            <CardDescription>500+ games available</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              PlayStation exclusives and classic titles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <ServiceBadge service="apple-arcade" />
            <CardTitle className="text-lg">Apple Arcade</CardTitle>
            <CardDescription>200+ games available</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Exclusive mobile and indie games
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <ServiceBadge service="geforce-now" />
            <CardTitle className="text-lg">GeForce Now</CardTitle>
            <CardDescription>1,500+ games supported</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Stream your existing PC game library
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="game-pass">
        <TabsList>
          <TabsTrigger value="game-pass" data-testid="tab-game-pass">Game Pass</TabsTrigger>
          <TabsTrigger value="ps-plus" data-testid="tab-ps-plus">PS Plus</TabsTrigger>
          <TabsTrigger value="apple-arcade" data-testid="tab-apple-arcade">Apple Arcade</TabsTrigger>
          <TabsTrigger value="geforce-now" data-testid="tab-geforce-now">GeForce Now</TabsTrigger>
        </TabsList>

        <TabsContent value="game-pass" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {serviceCatalog["game-pass"].map((game) => (
              <GameCard
                key={game.id}
                {...game}
                onClick={() => console.log('View game:', game.title)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ps-plus" className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {serviceCatalog["ps-plus"].map((game) => (
              <GameCard
                key={game.id}
                {...game}
                onClick={() => console.log('View game:', game.title)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="apple-arcade" className="mt-6">
          <p className="text-muted-foreground text-center py-8">
            Apple Arcade catalog coming soon...
          </p>
        </TabsContent>

        <TabsContent value="geforce-now" className="mt-6">
          <p className="text-muted-foreground text-center py-8">
            GeForce Now catalog coming soon...
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
