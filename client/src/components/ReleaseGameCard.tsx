import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetacriticScore } from "./MetacriticScore";
import { PlatformIcons } from "./PlatformIcons";
import { Calendar, Clock } from "lucide-react";

interface ReleaseGameCardProps {
  id: string;
  title: string;
  coverUrl: string;
  releaseDate: string;
  daysInfo: number;
  isReleased: boolean;
  metacritic?: number;
  platforms: string[];
  onClick?: () => void;
}

export function ReleaseGameCard({ 
  id, 
  title, 
  coverUrl, 
  releaseDate,
  daysInfo,
  isReleased,
  metacritic, 
  platforms,
  onClick 
}: ReleaseGameCardProps) {
  const dayText = isReleased 
    ? `${daysInfo} ${daysInfo === 1 ? 'day' : 'days'} ago`
    : `${daysInfo} ${daysInfo === 1 ? 'day' : 'days'} left`;

  return (
    <Card
      className="group hover-elevate cursor-pointer overflow-hidden transition-all duration-200"
      onClick={onClick}
      data-testid={`card-release-${id}`}
    >
      <div className="flex gap-4 p-4">
        <div className="relative flex-shrink-0">
          <div className="w-24 h-32 rounded-md overflow-hidden bg-muted">
            <img 
              src={coverUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <h3 className="font-display font-semibold text-base line-clamp-2" data-testid={`text-title-${id}`}>
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span data-testid={`text-release-date-${id}`}>{releaseDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {metacritic && <MetacriticScore score={metacritic} />}
            <PlatformIcons platforms={platforms} />
          </div>

          <Badge 
            variant={isReleased ? "default" : "secondary"}
            className="text-xs"
            data-testid={`badge-days-${id}`}
          >
            <Clock className="h-3 w-3 mr-1" />
            {dayText}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
