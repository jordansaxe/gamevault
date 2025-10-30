import { Button } from "@/components/ui/button";
import { Gamepad2, Library, Heart, ListPlus, Calendar, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative flex-1">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&h=1080&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
        
        <div className="relative container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen text-center">
          <div className="mb-8">
            <Gamepad2 className="h-20 w-20 text-primary mx-auto mb-4" />
            <h1 className="text-5xl md:text-6xl font-outfit font-bold mb-4">
              Track Your Gaming Journey
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Organize your game library, create custom lists, track new releases, and never miss a gaming event.
            </p>
          </div>

          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/login'}
            className="text-lg px-8 py-6 mb-16"
            data-testid="button-login"
          >
            Get Started
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mt-8">
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border">
              <Library className="h-10 w-10 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Personal Library</h3>
              <p className="text-sm text-muted-foreground">
                Track games you're playing, completed, or planning to play
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border">
              <Sparkles className="h-10 w-10 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">New Releases</h3>
              <p className="text-sm text-muted-foreground">
                Stay updated with the latest game releases from IGDB
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border">
              <Calendar className="h-10 w-10 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Gaming Events</h3>
              <p className="text-sm text-muted-foreground">
                Track major events like E3, State of Play, and Game Awards
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border">
              <Heart className="h-10 w-10 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Wishlist</h3>
              <p className="text-sm text-muted-foreground">
                Keep track of games you want and get notified on release
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border">
              <ListPlus className="h-10 w-10 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Custom Lists</h3>
              <p className="text-sm text-muted-foreground">
                Create personalized collections by genre, mood, or any criteria
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border">
              <Gamepad2 className="h-10 w-10 text-primary mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Platform Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Track which platform you own each game on (PS5, Xbox, PC, etc.)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
