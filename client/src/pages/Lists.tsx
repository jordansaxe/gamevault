import { ListCard } from "@/components/ListCard";
import { Button } from "@/components/ui/button";
import { Plus, ListPlus } from "lucide-react";

//todo: remove mock functionality
const customLists = [
  {
    id: "1",
    name: "Cozy Games",
    description: "Relaxing games for unwinding after work",
    gameCount: 12,
    coverImages: [
      "https://images.igdb.com/igdb/image/upload/t_cover_small/co49x5.jpg",
      "https://images.igdb.com/igdb/image/upload/t_cover_small/co1wyy.jpg",
      "https://images.igdb.com/igdb/image/upload/t_cover_small/co5vmg.jpg",
      "https://images.igdb.com/igdb/image/upload/t_cover_small/co2gvu.jpg",
    ],
  },
  {
    id: "2",
    name: "Must-Play RPGs",
    description: "Epic adventures and unforgettable stories",
    gameCount: 8,
    coverImages: [
      "https://images.igdb.com/igdb/image/upload/t_cover_small/co6qz4.jpg",
      "https://images.igdb.com/igdb/image/upload/t_cover_small/co5vb3.jpg",
      "https://images.igdb.com/igdb/image/upload/t_cover_small/co49x5.jpg",
      "https://images.igdb.com/igdb/image/upload/t_cover_small/co1wyy.jpg",
    ],
  },
  {
    id: "3",
    name: "Multiplayer Favorites",
    description: "Best games to play with friends",
    gameCount: 15,
    coverImages: [
      "https://images.igdb.com/igdb/image/upload/t_cover_small/co2gvu.jpg",
      "https://images.igdb.com/igdb/image/upload/t_cover_small/co6qz1.jpg",
      "https://images.igdb.com/igdb/image/upload/t_cover_small/co5vb3.jpg",
      "https://images.igdb.com/igdb/image/upload/t_cover_small/co6qz4.jpg",
    ],
  },
  {
    id: "4",
    name: "Horror Collection",
    description: "Spine-chilling experiences",
    gameCount: 6,
    coverImages: [
      "https://images.igdb.com/igdb/image/upload/t_cover_small/co6pjr.jpg",
      "https://images.igdb.com/igdb/image/upload/t_cover_small/co2gvu.jpg",
      "https://images.igdb.com/igdb/image/upload/t_cover_small/co49x5.jpg",
      "https://images.igdb.com/igdb/image/upload/t_cover_small/co1wyy.jpg",
    ],
  },
];

export default function Lists() {
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
              Create and organize custom game collections
            </p>
          </div>
        </div>
        <Button onClick={() => console.log('Create custom list')} data-testid="button-create-list">
          <Plus className="h-4 w-4 mr-2" />
          Create List
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customLists.map((list) => (
          <ListCard key={list.id} {...list} />
        ))}
      </div>
    </div>
  );
}
