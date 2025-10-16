import { ReleaseGameCard } from "@/components/ReleaseGameCard";
import { Sparkles } from "lucide-react";

//todo: remove mock functionality
const newReleases = [
  {
    id: "1",
    igdbId: 119133,
    title: "Baldur's Gate 3",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5vb3.jpg",
    releaseDate: "Aug 3, 2023",
    daysInfo: 3,
    isReleased: true,
    metacritic: 96,
    platforms: ["ps5", "pc"],
  },
  {
    id: "2",
    igdbId: 214905,
    title: "Spider-Man 2",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6qz1.jpg",
    releaseDate: "Oct 20, 2023",
    daysInfo: 7,
    isReleased: true,
    metacritic: 90,
    platforms: ["ps5"],
  },
  {
    id: "3",
    igdbId: 213210,
    title: "Alan Wake 2",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6s48.jpg",
    releaseDate: "Oct 27, 2023",
    daysInfo: 14,
    isReleased: true,
    metacritic: 89,
    platforms: ["ps5", "xbox", "pc"],
  },
  {
    id: "4",
    igdbId: 139431,
    title: "Hogwarts Legacy",
    coverUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6nq7.jpg",
    releaseDate: "Feb 10, 2023",
    daysInfo: 21,
    isReleased: true,
    metacritic: 84,
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
