import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  id: string;
  name: string;
  date: string;
  description: string;
  imageUrl: string;
  gameCount: number;
}

export function EventCard({ id, name, date, description, imageUrl, gameCount }: EventCardProps) {
  return (
    <Card 
      className="overflow-hidden hover-elevate cursor-pointer"
      data-testid={`card-event-${id}`}
    >
      <div className="relative h-32">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <Badge className="bg-primary text-primary-foreground border-transparent">
            <Calendar className="h-3 w-3 mr-1" />
            {date}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="space-y-1.5">
        <CardTitle className="text-lg font-display">{name}</CardTitle>
        <CardDescription className="text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {gameCount} games announced
          </span>
          <Button 
            size="sm"
            onClick={() => console.log('View event:', name)}
            data-testid={`button-view-event-${id}`}
          >
            <Plus className="h-4 w-4 mr-1" />
            View Games
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
