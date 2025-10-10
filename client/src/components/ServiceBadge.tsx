import { Badge } from "@/components/ui/badge";

type Service = "ps-plus" | "game-pass" | "apple-arcade" | "geforce-now";

interface ServiceBadgeProps {
  service: Service;
  tier?: string;
}

const serviceConfig = {
  "ps-plus": { 
    label: "PS+", 
    className: "bg-[hsl(0,85%,60%)] text-white hover:bg-[hsl(0,85%,55%)] border-transparent"
  },
  "game-pass": { 
    label: "Game Pass", 
    className: "bg-[hsl(142,75%,50%)] text-white hover:bg-[hsl(142,75%,45%)] border-transparent"
  },
  "apple-arcade": { 
    label: "Apple", 
    className: "bg-[hsl(25,95%,55%)] text-white hover:bg-[hsl(25,95%,50%)] border-transparent"
  },
  "geforce-now": { 
    label: "GeForce", 
    className: "bg-[hsl(85,70%,55%)] text-white hover:bg-[hsl(85,70%,50%)] border-transparent"
  },
};

export function ServiceBadge({ service, tier }: ServiceBadgeProps) {
  const config = serviceConfig[service];
  
  return (
    <Badge 
      className={`text-xs font-medium ${config.className}`}
      data-testid={`badge-service-${service}`}
    >
      {config.label}
      {tier && ` ${tier}`}
    </Badge>
  );
}
