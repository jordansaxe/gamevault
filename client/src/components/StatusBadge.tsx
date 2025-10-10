import { Badge } from "@/components/ui/badge";

type GameStatus = "playing" | "completed" | "backlog" | "dropped" | "wishlist";

interface StatusBadgeProps {
  status: GameStatus;
}

const statusConfig = {
  playing: { label: "Playing", variant: "default" as const },
  completed: { label: "Completed", variant: "secondary" as const },
  backlog: { label: "Backlog", variant: "outline" as const },
  dropped: { label: "Dropped", variant: "outline" as const },
  wishlist: { label: "Wishlist", variant: "outline" as const },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} className="text-xs" data-testid={`badge-status-${status}`}>
      {config.label}
    </Badge>
  );
}
