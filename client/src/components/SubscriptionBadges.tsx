import { Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SubscriptionBadgesProps {
  gamePassConsole?: boolean;
  gamePassPC?: boolean;
  psPlus?: boolean;
  geforceNow?: boolean;
}

export function SubscriptionBadges({ gamePassConsole, gamePassPC, psPlus, geforceNow }: SubscriptionBadgesProps) {
  const badges = [];

  if (gamePassConsole) {
    badges.push(
      <Badge key="gp-console" variant="secondary" className="gap-1" data-testid="badge-gamepass-console">
        <Gamepad2 className="h-3 w-3" />
        <span className="text-xs">Game Pass</span>
      </Badge>
    );
  }

  if (gamePassPC) {
    badges.push(
      <Badge key="gp-pc" variant="secondary" className="gap-1" data-testid="badge-gamepass-pc">
        <Gamepad2 className="h-3 w-3" />
        <span className="text-xs">PC Game Pass</span>
      </Badge>
    );
  }

  if (psPlus) {
    badges.push(
      <Badge key="ps-plus" variant="secondary" className="gap-1" data-testid="badge-psplus">
        <Gamepad2 className="h-3 w-3" />
        <span className="text-xs">PS Plus</span>
      </Badge>
    );
  }

  if (geforceNow) {
    badges.push(
      <Badge key="gfn" variant="secondary" className="gap-1" data-testid="badge-geforce-now">
        <Gamepad2 className="h-3 w-3" />
        <span className="text-xs">GeForce NOW</span>
      </Badge>
    );
  }

  if (badges.length === 0) {
    return null;
  }

  return <div className="flex flex-wrap gap-1">{badges}</div>;
}
