import { ReleaseGameCard } from "@/components/ReleaseGameCard";
import { Sparkles } from "lucide-react";

//todo: remove mock functionality
const newReleases = [
  {
    id: "1",
    igdbId: 133236,
    title: "Final Fantasy VII Rebirth",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co7jd3.jpg",
    releaseDate: "Feb 29, 2024",
    daysInfo: 3,
    isReleased: true,
    metacritic: 92,
    platforms: ["ps5"],
  },
  {
    id: "2",
    igdbId: 230710,
    title: "Helldivers 2",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co7jg9.jpg",
    releaseDate: "Feb 8, 2024",
    daysInfo: 7,
    isReleased: true,
    metacritic: 82,
    platforms: ["ps5", "pc"],
  },
  {
    id: "3",
    igdbId: 230177,
    title: "Prince of Persia: The Lost Crown",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6z8r.jpg",
    releaseDate: "Jan 18, 2024",
    daysInfo: 14,
    isReleased: true,
    metacritic: 86,
    platforms: ["ps5", "xbox", "pc", "switch"],
  },
  {
    id: "4",
    igdbId: 230712,
    title: "Like a Dragon: Infinite Wealth",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co7ba5.jpg",
    releaseDate: "Jan 26, 2024",
    daysInfo: 21,
    isReleased: true,
    metacritic: 89,
    platforms: ["ps5", "xbox", "pc"],
  },
];

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {newReleases.map((game) => (
          <ReleaseGameCard
            key={game.id}
            {...game}
          />
        ))}
      </div>
    </div>
  );
}
