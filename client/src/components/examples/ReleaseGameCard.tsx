import { ReleaseGameCard } from "../ReleaseGameCard";

export default function ReleaseGameCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <ReleaseGameCard
        id="1"
        title="Baldur's Gate 3"
        coverUrl="https://images.igdb.com/igdb/image/upload/t_cover_big/co5vb3.jpg"
        releaseDate="Aug 3, 2023"
        daysInfo={3}
        isReleased={true}
        metacritic={96}
        platforms={["ps5", "pc"]}
        onClick={() => console.log('Clicked')}
      />
      <ReleaseGameCard
        id="2"
        title="Grand Theft Auto VI"
        coverUrl="https://images.igdb.com/igdb/image/upload/t_cover_big/co87w4.jpg"
        releaseDate="2025"
        daysInfo={180}
        isReleased={false}
        platforms={["ps5", "xbox"]}
        onClick={() => console.log('Clicked')}
      />
    </div>
  );
}
