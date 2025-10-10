import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function GameSearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative flex-1 max-w-xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search games..."
        className="pl-9"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          console.log('Search query:', e.target.value);
        }}
        data-testid="input-game-search"
      />
    </div>
  );
}
