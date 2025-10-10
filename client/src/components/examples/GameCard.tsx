import { GameCard } from "../GameCard";

export default function GameCardExample() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl">
      <GameCard
        id="1"
        title="The Last of Us Part II"
        coverUrl="https://images.igdb.com/igdb/image/upload/t_cover_big/co2gvu.jpg"
        status="playing"
        metacritic={93}
        platforms={["ps5", "ps4"]}
        services={[{ service: "ps-plus", tier: "Extra" }]}
        onClick={() => console.log('Clicked game')}
      />
      <GameCard
        id="2"
        title="Starfield"
        coverUrl="https://images.igdb.com/igdb/image/upload/t_cover_big/co6qz4.jpg"
        status="backlog"
        metacritic={83}
        platforms={["xbox", "pc"]}
        services={[{ service: "game-pass", tier: "Ultimate" }]}
        onClick={() => console.log('Clicked game')}
      />
      <GameCard
        id="3"
        title="Zelda: Tears of the Kingdom"
        coverUrl="https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.jpg"
        status="completed"
        metacritic={96}
        platforms={["switch"]}
      />
    </div>
  );
}
