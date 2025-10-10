import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { ServiceBadge } from "./ServiceBadge";
import { MetacriticScore } from "./MetacriticScore";
import { PlatformIcons } from "./PlatformIcons";
import { Plus, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GameCardProps {
  id: string;
  title: string;
  coverUrl: string;
  status?: "playing" | "completed" | "backlog" | "dropped" | "wishlist";
  metacritic?: number;
  platforms: string[];
  services?: Array<{ service: "ps-plus" | "game-pass" | "apple-arcade" | "geforce-now"; tier?: string }>;
  onClick?: () => void;
}

export function GameCard({ 
  id, 
  title, 
  coverUrl, 
  status, 
  metacritic, 
  platforms, 
  services,
  onClick 
}: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group relative overflow-hidden hover-elevate cursor-pointer transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      data-testid={`card-game-${id}`}
    >
      <div className="aspect-[3/4] relative">
        <img 
          src={coverUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {status && (
          <div className="absolute top-2 right-2">
            <StatusBadge status={status} />
          </div>
        )}

        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
            <h3 className="font-display font-semibold text-white text-sm line-clamp-2">
              {title}
            </h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {metacritic && <MetacriticScore score={metacritic} />}
                <PlatformIcons platforms={platforms} />
              </div>
            </div>

            {services && services.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {services.map((svc, i) => (
                  <ServiceBadge key={i} service={svc.service} tier={svc.tier} />
                ))}
              </div>
            )}

            <div className="flex gap-1 pt-1">
              <Button 
                size="sm" 
                variant="secondary" 
                className="flex-1 h-7 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Add to list:', title);
                }}
                data-testid={`button-add-to-list-${id}`}
              >
                <List className="h-3 w-3 mr-1" />
                Add to List
              </Button>
              <Button 
                size="sm" 
                variant="secondary" 
                className="h-7 w-7 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Quick add:', title);
                }}
                data-testid={`button-quick-add-${id}`}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
