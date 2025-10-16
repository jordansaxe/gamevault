import { ReleaseGameCard } from "@/components/ReleaseGameCard";
import { Clock } from "lucide-react";

//todo: remove mock functionality
// Using games with verified IGDB IDs only
const upcomingGames = [
  {
    id: "1",
    igdbId: 119171,
    title: "Baldur's Gate 3",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5vb3.jpg",
    releaseDate: "Aug 3, 2023",
    daysInfo: 30,
    isReleased: true,
    metacritic: 96,
    platforms: ["ps5", "xbox", "pc"],
  },
  {
    id: "2",
    igdbId: 119133,
    title: "Elden Ring",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg",
    releaseDate: "Feb 25, 2022",
    daysInfo: 60,
    isReleased: true,
    metacritic: 96,
    platforms: ["ps5", "xbox", "pc"],
  },
  {
    id: "3",
    igdbId: 103305,
    title: "Cyberpunk 2077",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1rbo.jpg",
    releaseDate: "Dec 10, 2020",
    daysInfo: 90,
    isReleased: true,
    metacritic: 86,
    platforms: ["ps5", "xbox", "pc"],
  },
  {
    id: "4",
    igdbId: 1942,
    title: "The Witcher 3: Wild Hunt",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
    releaseDate: "May 19, 2015",
    daysInfo: 120,
    isReleased: true,
    metacritic: 92,
    platforms: ["ps5", "xbox", "pc", "switch"],
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
