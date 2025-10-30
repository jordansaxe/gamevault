import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon, ExternalLink, Gamepad2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { Game } from "@shared/schema";

interface GamingEvent {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string | null;
  liveStreamUrl: string | null;
  logoUrl: string;
  networks: string[];
  games: string[];
}

export default function Calendar() {
  const { data: events, isLoading: eventsLoading } = useQuery<GamingEvent[]>({
    queryKey: ["/api/events"],
  });

  const { data: userGames, isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const wishlistGames = userGames
    ?.filter(game => game.status === "wishlist" && game.releaseDate)
    .sort((a, b) => {
      const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
      const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
      return dateA - dateB;
    }) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-outfit font-semibold flex items-center gap-2" data-testid="text-calendar-title">
          <CalendarIcon className="h-8 w-8 text-primary" />
          Calendar
        </h1>
        <p className="text-muted-foreground mt-1">
          Track gaming events and upcoming releases from your wishlist
        </p>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList>
          <TabsTrigger value="events" data-testid="tab-events">Gaming Events</TabsTrigger>
          <TabsTrigger value="wishlist" data-testid="tab-wishlist">Wishlist Releases</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-6">
          {eventsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading gaming events...</p>
            </div>
          ) : !events || events.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-2">No upcoming gaming events</p>
              <p className="text-sm text-muted-foreground">
                Check back later for major gaming announcements
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <Card key={event.id} className="hover-elevate" data-testid={`card-event-${event.id}`}>
                  {event.logoUrl && (
                    <div className="relative h-40 w-full overflow-hidden rounded-t-md">
                      <img
                        src={event.logoUrl}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg font-outfit" data-testid={`text-event-name-${event.id}`}>
                      {event.name}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground" data-testid={`text-event-date-${event.id}`}>
                      {format(new Date(event.startTime), 'MMMM d, yyyy • h:mm a')}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-event-desc-${event.id}`}>
                        {event.description}
                      </p>
                    )}
                    {event.networks && event.networks.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {event.networks.slice(0, 3).map((network, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {network}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {event.games && event.games.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <Gamepad2 className="h-3 w-3 inline mr-1" />
                        {event.games.length} game{event.games.length !== 1 ? 's' : ''}
                      </div>
                    )}
                    {event.liveStreamUrl && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.open(event.liveStreamUrl!, '_blank')}
                        data-testid={`button-livestream-${event.id}`}
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Watch Livestream
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="wishlist" className="mt-6">
          {gamesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading wishlist...</p>
            </div>
          ) : wishlistGames.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-2">No upcoming releases in your wishlist</p>
              <p className="text-sm text-muted-foreground">
                Add games to your wishlist to track their release dates
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlistGames.map((game) => (
                <Card key={game.id} className="hover-elevate" data-testid={`card-wishlist-game-${game.id}`}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <img
                      src={game.coverUrl || 'https://via.placeholder.com/100x140?text=No+Cover'}
                      alt={game.name}
                      className="w-20 h-28 object-cover rounded-md flex-shrink-0"
                      data-testid={`img-game-cover-${game.id}`}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-outfit font-semibold text-lg mb-1 truncate" data-testid={`text-game-name-${game.id}`}>
                        {game.name}
                      </h3>
                      {game.releaseDate && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span data-testid={`text-release-date-${game.id}`}>
                            {format(new Date(game.releaseDate), 'MMMM d, yyyy')}
                          </span>
                        </div>
                      )}
                      {game.platform && (
                        <Badge variant="secondary" className="text-xs">
                          {game.platform}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
