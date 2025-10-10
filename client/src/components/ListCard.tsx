import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MoreVertical, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListCardProps {
  id: string;
  name: string;
  description: string;
  gameCount: number;
  coverImages: string[];
}

export function ListCard({ id, name, description, gameCount, coverImages }: ListCardProps) {
  return (
    <Card 
      className="hover-elevate cursor-pointer"
      data-testid={`card-list-${id}`}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex-1 space-y-1">
          <CardTitle className="text-base font-display">{name}</CardTitle>
          <CardDescription className="text-xs">
            {description}
          </CardDescription>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 cursor-grab"
            data-testid={`button-drag-list-${id}`}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              console.log('List options:', name);
            }}
            data-testid={`button-list-options-${id}`}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-4 gap-1 mb-3">
          {coverImages.slice(0, 4).map((img, i) => (
            <div key={i} className="aspect-[3/4] rounded-sm overflow-hidden bg-muted">
              <img 
                src={img} 
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {gameCount} {gameCount === 1 ? 'game' : 'games'}
        </p>
      </CardContent>
    </Card>
  );
}
