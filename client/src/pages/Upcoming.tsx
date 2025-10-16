import { ReleaseGameCard } from "@/components/ReleaseGameCard";
import { Clock } from "lucide-react";

//todo: remove mock functionality
const upcomingGames = [
  {
    id: "1",
    igdbId: 204363,
    title: "Grand Theft Auto VI",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co87w4.jpg",
    releaseDate: "Fall 2025",
    daysInfo: 180,
    isReleased: false,
    platforms: ["ps5", "xbox"],
  },
  {
    id: "2",
    igdbId: 113806,
    title: "Hollow Knight: Silksong",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2m7r.jpg",
    releaseDate: "TBA 2025",
    daysInfo: 90,
    isReleased: false,
    platforms: ["switch", "pc"],
  },
  {
    id: "3",
    igdbId: 127344,
    title: "Fable",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6mz4.jpg",
    releaseDate: "2025",
    daysInfo: 120,
    isReleased: false,
    platforms: ["xbox", "pc"],
  },
  {
    id: "4",
    igdbId: 121390,
    title: "The Wolf Among Us 2",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2ma1.jpg",
    releaseDate: "2025",
    daysInfo: 150,
    isReleased: false,
    platforms: ["ps5", "xbox", "pc"],
  },
];

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upcomingGames.map((game) => (
          <ReleaseGameCard
            key={game.id}
            {...game}
          />
        ))}
      </div>
    </div>
  );
}
