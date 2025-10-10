import { ListCard } from "../ListCard";

export default function ListCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <ListCard
        id="1"
        name="Cozy Games"
        description="Relaxing games for unwinding"
        gameCount={12}
        coverImages={[
          "https://images.igdb.com/igdb/image/upload/t_cover_small/co49x5.jpg",
          "https://images.igdb.com/igdb/image/upload/t_cover_small/co1wyy.jpg",
          "https://images.igdb.com/igdb/image/upload/t_cover_small/co5vmg.jpg",
          "https://images.igdb.com/igdb/image/upload/t_cover_small/co2gvu.jpg",
        ]}
      />
      <ListCard
        id="2"
        name="Must-Play RPGs"
        description="Epic adventures and stories"
        gameCount={8}
        coverImages={[
          "https://images.igdb.com/igdb/image/upload/t_cover_small/co6qz4.jpg",
          "https://images.igdb.com/igdb/image/upload/t_cover_small/co2gvu.jpg",
          "https://images.igdb.com/igdb/image/upload/t_cover_small/co49x5.jpg",
          "https://images.igdb.com/igdb/image/upload/t_cover_small/co1wyy.jpg",
        ]}
      />
    </div>
  );
}
