import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon, ExternalLink, Gamepad2, Filter, ChevronRight, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubscriptionBadges } from "@/components/SubscriptionBadges";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, formatDistanceToNow, isPast } from "date-fns";
import type { Game } from "@shared/schema";
import { useState } from "react";
import { Link } from "wouter";

interface EventGame {
  id: number;
  name: string;
  coverUrl: string;
}

interface GamingEvent {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string | null;
  liveStreamUrl: string | null;
  logoUrl: string;
  networks: string[];
  games: EventGame[];
}

function EventCard({ event, isPastEvent }: { event: GamingEvent; isPastEvent?: boolean }) {
  const eventDate = new Date(event.startTime);
  const timeLabel = isPastEvent 
    ? `${formatDistanceToNow(eventDate)} ago`
    : `in ${formatDistanceToNow(eventDate)}`;

  return (
    <Link href={`/event/${event.id}`}>
      <Card className="hover-elevate overflow-hidden cursor-pointer h-full" data-testid={`card-event-${event.id}`}>
      {event.logoUrl && (
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={event.logoUrl}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 left-3 right-3">
            <Badge variant="secondary" className="text-xs bg-background/80 backdrop-blur">
              <Clock className="h-3 w-3 mr-1" />
              {timeLabel}
            </Badge>
          </div>
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-outfit line-clamp-2" data-testid={`text-event-name-${event.id}`}>
          {event.name}
        </CardTitle>
        <div className="text-sm text-muted-foreground" data-testid={`text-event-date-${event.id}`}>
          {format(eventDate, 'MMMM d, yyyy • h:mm a')}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-event-desc-${event.id}`}>
            {event.description}
          </p>
        )}
        
        {event.games && event.games.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Gamepad2 className="h-3 w-3" />
              <span>{event.games.length} game{event.games.length !== 1 ? 's' : ''} featured</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {event.games.slice(0, 6).map((game) => (
                <Link key={game.id} href={`/game/${game.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2"
                    data-testid={`button-game-${game.id}`}
                  >
                    {game.coverUrl && (
                      <img 
                        src={game.coverUrl} 
                        alt={game.name}
                        className="h-4 w-3 object-cover rounded-sm mr-1"
                      />
                    )}
                    <span className="truncate max-w-[100px]">{game.name}</span>
                  </Button>
                </Link>
              ))}
              {event.games.length > 6 && (
                <Badge variant="secondary" className="text-xs">
                  +{event.games.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {event.liveStreamUrl && !isPastEvent && (
          <Button 
            variant="default" 
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
    </Link>
  );
}

function EventsSection({ 
  title, 
  events, 
  isLoading, 
  isPastEvents = false,
  emptyMessage 
}: { 
  title: string;
  events: GamingEvent[] | undefined;
  isLoading: boolean;
  isPastEvents?: boolean;
  emptyMessage: string;
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-outfit font-semibold flex items-center gap-2">
          {title}
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-muted-foreground text-sm">Loading events...</p>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-outfit font-semibold flex items-center gap-2">
          {title}
        </h2>
        <div className="text-center py-8 border border-dashed rounded-lg">
          <CalendarIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-outfit font-semibold flex items-center gap-2">
        {title}
        <Badge variant="secondary">{events.length}</Badge>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} isPastEvent={isPastEvents} />
        ))}
      </div>
    </div>
  );
}

export default function Calendar() {
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>("all");

  const { data: upcomingEvents, isLoading: upcomingLoading } = useQuery<GamingEvent[]>({
    queryKey: ["/api/events"],
  });

  const { data: pastEvents, isLoading: pastLoading } = useQuery<GamingEvent[]>({
    queryKey: ["/api/events/past"],
  });

  const { data: userGames, isLoading: gamesLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const wishlistGames = userGames
    ?.filter(game => {
      if (game.status !== "wishlist" || !game.releaseDate) return false;
      
      if (subscriptionFilter === "all") return true;
      if (subscriptionFilter === "gamepass") return game.gamePassConsole || game.gamePassPC;
      if (subscriptionFilter === "psplus") return game.psPlus;
      if (subscriptionFilter === "geforce") return game.geforceNow;
      
      return true;
    })
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

        <TabsContent value="events" className="mt-6 space-y-8">
          <EventsSection
            title="Upcoming Events"
            events={upcomingEvents}
            isLoading={upcomingLoading}
            emptyMessage="No upcoming gaming events scheduled"
          />
          
          <EventsSection
            title="Previous Events (Last 6 Months)"
            events={pastEvents}
            isLoading={pastLoading}
            isPastEvents={true}
            emptyMessage="No past events found in the last 6 months"
          />
        </TabsContent>

        <TabsContent value="wishlist" className="mt-6">
          <div className="mb-4 flex items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
              <SelectTrigger className="w-[200px]" data-testid="select-subscription-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Games</SelectItem>
                <SelectItem value="gamepass">Game Pass</SelectItem>
                <SelectItem value="psplus">PlayStation Plus</SelectItem>
                <SelectItem value="geforce">GeForce NOW</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                      <div className="space-y-2">
                        {game.platform && (
                          <Badge variant="secondary" className="text-xs">
                            {game.platform}
                          </Badge>
                        )}
                        <SubscriptionBadges 
                          gamePassConsole={game.gamePassConsole || undefined}
                          gamePassPC={game.gamePassPC || undefined}
                          psPlus={game.psPlus || undefined}
                          geforceNow={game.geforceNow || undefined}
                        />
                      </div>
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
