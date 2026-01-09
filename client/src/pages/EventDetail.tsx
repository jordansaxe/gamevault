import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowLeft, ExternalLink, Gamepad2, Clock } from "lucide-react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { useLocation } from "wouter";

interface EventGame {
  id: number;
  name: string;
  coverUrl: string;
  summary: string;
  releaseDate: string | null;
  platforms: string[];
  genres: string[];
}

interface EventDetail {
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

export default function EventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const [, setLocation] = useLocation();

  const { data: eventDetail, isLoading } = useQuery<EventDetail>({
    queryKey: ["/api/events", eventId],
    enabled: !!eventId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!eventDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Event not found</p>
          <Button onClick={() => setLocation("/calendar")} className="mt-4" data-testid="button-back-calendar">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Calendar
          </Button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(eventDetail.startTime);
  const isEventPast = isPast(eventDate);
  const timeLabel = isEventPast 
    ? `${formatDistanceToNow(eventDate)} ago`
    : `in ${formatDistanceToNow(eventDate)}`;

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => setLocation("/calendar")} 
        className="mb-4"
        data-testid="button-back"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Calendar
      </Button>

      <div className="relative rounded-lg overflow-hidden">
        {eventDetail.logoUrl && (
          <div className="relative h-64 md:h-80 w-full">
            <img
              src={eventDetail.logoUrl}
              alt={eventDetail.name}
              className="w-full h-full object-cover"
              data-testid="img-event-logo"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <Badge variant="secondary" className="mb-3 bg-background/80 backdrop-blur">
                <Clock className="h-3 w-3 mr-1" />
                {timeLabel}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-outfit font-bold text-white mb-2" data-testid="text-event-title">
                {eventDetail.name}
              </h1>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="h-4 w-4" />
                <span data-testid="text-event-date">
                  {format(eventDate, 'EEEE, MMMM d, yyyy • h:mm a')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {eventDetail.description && (
          <div>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-event-description">
              {eventDetail.description}
            </p>
          </div>
        )}

        {eventDetail.liveStreamUrl && (
          <Button 
            onClick={() => window.open(eventDetail.liveStreamUrl!, '_blank')}
            className="w-full sm:w-auto"
            data-testid="button-watch-video"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {isEventPast ? 'Watch Recording' : 'Watch Livestream'}
          </Button>
        )}

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-outfit font-semibold">
              Featured Games
              {eventDetail.games.length > 0 && (
                <Badge variant="secondary" className="ml-2">{eventDetail.games.length}</Badge>
              )}
            </h2>
          </div>

          {eventDetail.games.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <Gamepad2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No games announced for this event yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventDetail.games.map((game) => (
                <Link key={game.id} href={`/game/${game.id}`}>
                  <Card className="hover-elevate cursor-pointer h-full" data-testid={`card-game-${game.id}`}>
                    <CardContent className="p-0">
                      <div className="flex gap-4 p-4">
                        <img
                          src={game.coverUrl || 'https://via.placeholder.com/120x160?text=No+Cover'}
                          alt={game.name}
                          className="w-24 h-32 object-cover rounded-md flex-shrink-0"
                          data-testid={`img-game-cover-${game.id}`}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-outfit font-semibold text-base mb-1 line-clamp-2" data-testid={`text-game-name-${game.id}`}>
                            {game.name}
                          </h3>
                          {game.releaseDate && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                              <Calendar className="h-3 w-3" />
                              <span>{format(new Date(game.releaseDate), 'MMM d, yyyy')}</span>
                            </div>
                          )}
                          {game.genres.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {game.genres.slice(0, 2).map((genre) => (
                                <Badge key={genre} variant="outline" className="text-xs">
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {game.summary && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {game.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
