import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MetacriticScore } from "@/components/MetacriticScore";
import { PlatformIcons } from "@/components/PlatformIcons";
import { SubscriptionBadges } from "@/components/SubscriptionBadges";
import { Calendar, Users, Gamepad2, Eye, ArrowLeft, Plus, Check, Clock } from "lucide-react";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from "wouter";

interface GameDetail {
  igdbId: number;
  name: string;
  coverUrl: string;
  releaseDate: string | null;
  platforms: string[];
  metacriticScore: number;
  summary: string;
  storyline: string;
  genres: string[];
  developers: string[];
  publishers: string[];
  screenshots: string[];
  videos: Array<{ id: number; video_id: string; name: string }>;
  gameModes: string[];
  playerPerspectives: string[];
  themes: string[];
  ratingCount: number;
}

export default function GameDetail() {
  const { igdbId } = useParams<{ igdbId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string>("backlog");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");

  const { data: gameDetail, isLoading } = useQuery<GameDetail>({
    queryKey: ["/api/games/igdb", igdbId],
    enabled: !!igdbId,
  });

  const { data: userGames } = useQuery<Array<{ igdbId: number; status: string }>>({
    queryKey: ["/api/games"],
  });

  const { data: playtimeData } = useQuery<{ mainStoryHours: number | null; completionistHours: number | null }>({
    queryKey: [`/api/games/${igdbId}/playtime`],
    enabled: !!igdbId,
  });

  const { data: subscriptionData } = useQuery<{
    gamePassConsole: boolean;
    gamePassPC: boolean;
    psPlus: boolean;
    geforceNow: boolean;
  }>({
    queryKey: [`/api/games/${igdbId}/subscriptions`],
    enabled: !!igdbId,
  });

  const platformMapping: Record<string, string> = {
    'PlayStation 5': 'PlayStation 5',
    'PlayStation 4': 'PlayStation 4',
    'PlayStation 3': 'PlayStation 3',
    'PlayStation 2': 'PlayStation 2',
    'Xbox Series X|S': 'Xbox Series X/S',
    'Xbox One': 'Xbox One',
    'Xbox 360': 'Xbox 360',
    'Nintendo Switch': 'Nintendo Switch',
    'Wii U': 'Wii U',
    'Wii': 'Wii',
    'PC (Microsoft Windows)': 'PC',
    'Mac': 'Mac',
    'Linux': 'Linux',
    'Android': 'Android',
    'iOS': 'iOS',
  };

  const platformLabelMapping: Record<string, string> = {
    'PlayStation 5': 'PlayStation 5',
    'PlayStation 4': 'PlayStation 4',
    'PlayStation 3': 'PlayStation 3',
    'PlayStation 2': 'PlayStation 2',
    'Xbox Series X/S': 'Xbox Series X/S',
    'Xbox One': 'Xbox One',
    'Xbox 360': 'Xbox 360',
    'Nintendo Switch': 'Nintendo Switch',
    'Wii U': 'Wii U',
    'Wii': 'Wii',
    'PC': 'PC',
    'Mac': 'Mac',
    'Linux': 'Linux',
    'Android': 'Android',
    'iOS': 'iOS',
  };

  const defaultPlatforms = ['PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One', 'Nintendo Switch', 'PC', 'Mac'];

  const availablePlatformsFromIGDB = gameDetail?.platforms
    .map(platform => platformMapping[platform] || platform)
    .filter((value, index, self) => self.indexOf(value) === index) || [];

  const platformOptions = availablePlatformsFromIGDB.length > 0 
    ? availablePlatformsFromIGDB 
    : defaultPlatforms;

  const userGame = userGames?.find(g => g.igdbId === gameDetail?.igdbId);

  const addGameMutation = useMutation({
    mutationFn: async ({ status, platform }: { status: string; platform: string | null }) => {
      if (!gameDetail) throw new Error("No game data");
      
      return apiRequest("POST", "/api/games", {
        igdbId: gameDetail.igdbId,
        name: gameDetail.name,
        coverUrl: gameDetail.coverUrl,
        releaseDate: gameDetail.releaseDate,
        platforms: gameDetail.platforms,
        metacriticScore: gameDetail.metacriticScore,
        summary: gameDetail.summary,
        genres: gameDetail.genres,
        status,
        platform: platform || null,
      });
    },
    onSuccess: (_, { status }) => {
      toast({
        title: "Success!",
        description: `${gameDetail?.name} has been added to your ${status}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add game",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ gameId, status }: { gameId: string; status: string }) => {
      return apiRequest("PATCH", `/api/games/${gameId}/status`, { status });
    },
    onSuccess: (_, { status }) => {
      toast({
        title: "Updated!",
        description: `Status changed to ${status}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading game details...</p>
        </div>
      </div>
    );
  }

  if (!gameDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Game not found</p>
          <Button onClick={() => setLocation("/library")} className="mt-4" data-testid="button-back-library">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="relative h-[400px] w-full">
        {gameDetail.screenshots?.[0] ? (
          <>
            <img
              src={gameDetail.screenshots[0]}
              alt={gameDetail.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        
        <div className="absolute top-4 left-4">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="bg-background/80 backdrop-blur-sm"
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <img
              src={gameDetail.coverUrl || 'https://via.placeholder.com/300x400?text=No+Cover'}
              alt={gameDetail.name}
              className="w-full rounded-md shadow-2xl"
              data-testid="img-game-cover"
            />
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-4xl font-outfit font-bold mb-2" data-testid="text-game-title">
                {gameDetail.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {gameDetail.metacriticScore > 0 && (
                  <MetacriticScore score={gameDetail.metacriticScore} />
                )}
                <PlatformIcons platforms={gameDetail.platforms} />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {gameDetail.genres.map((genre) => (
                  <Badge key={genre} variant="secondary" data-testid={`badge-genre-${genre}`}>
                    {genre}
                  </Badge>
                ))}
              </div>

              {subscriptionData && (
                <div className="mb-4">
                  <SubscriptionBadges
                    gamePassConsole={subscriptionData.gamePassConsole}
                    gamePassPC={subscriptionData.gamePassPC}
                    psPlus={subscriptionData.psPlus}
                    geforceNow={subscriptionData.geforceNow}
                  />
                </div>
              )}
            </div>

            {!userGame ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px]" data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="backlog">Backlog</SelectItem>
                      <SelectItem value="playing">Playing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="wishlist">Wishlist</SelectItem>
                      <SelectItem value="dropped">Dropped</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="w-[180px]" data-testid="select-platform">
                      <SelectValue placeholder="Select platform (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {platformOptions.map(platform => (
                        <SelectItem key={platform} value={platform}>
                          {platformLabelMapping[platform] || platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => addGameMutation.mutate({ status: selectedStatus, platform: selectedPlatform || null })}
                  disabled={addGameMutation.isPending}
                  data-testid="button-add-to-library"
                  className="w-full sm:w-auto"
                >
                  {addGameMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add to Library
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="text-sm" data-testid="badge-in-library">
                  <Check className="mr-1 h-3 w-3" />
                  In your library
                </Badge>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gameDetail.releaseDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Release Date</p>
                    <p className="font-medium" data-testid="text-release-date">
                      {format(new Date(gameDetail.releaseDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
              )}

              {gameDetail.developers.length > 0 && (
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Developer</p>
                    <p className="font-medium" data-testid="text-developer">
                      {gameDetail.developers.join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {gameDetail.gameModes.length > 0 && (
                <div className="flex items-start gap-3">
                  <Gamepad2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Game Modes</p>
                    <p className="font-medium" data-testid="text-game-modes">
                      {gameDetail.gameModes.join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {gameDetail.playerPerspectives.length > 0 && (
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Perspective</p>
                    <p className="font-medium" data-testid="text-perspective">
                      {gameDetail.playerPerspectives.join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {playtimeData && (playtimeData.mainStoryHours || playtimeData.completionistHours) && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time to Beat</p>
                    <div className="space-y-1">
                      {playtimeData.mainStoryHours && (
                        <p className="font-medium text-sm" data-testid="text-main-story-hours">
                          Main Story: {playtimeData.mainStoryHours}h
                        </p>
                      )}
                      {playtimeData.completionistHours && (
                        <p className="font-medium text-sm" data-testid="text-completionist-hours">
                          Completionist: {playtimeData.completionistHours}h
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {gameDetail.summary && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Summary</h2>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-summary">
                  {gameDetail.summary}
                </p>
              </div>
            )}

            {gameDetail.storyline && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Storyline</h2>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-storyline">
                  {gameDetail.storyline}
                </p>
              </div>
            )}

            {gameDetail.screenshots.length > 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gameDetail.screenshots.slice(1, 7).map((screenshot, index) => (
                    <img
                      key={index}
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full rounded-md hover-elevate cursor-pointer transition-all"
                      data-testid={`img-screenshot-${index}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
