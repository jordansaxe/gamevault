import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppSidebar } from "@/components/AppSidebar";
import { GameSearchBar } from "@/components/GameSearchBar";
import { useAuth } from "@/hooks/useAuth";
import NewReleases from "@/pages/NewReleases";
import Upcoming from "@/pages/Upcoming";
import Library from "@/pages/Library";
import Wishlist from "@/pages/Wishlist";
import Lists from "@/pages/Lists";
import Calendar from "@/pages/Calendar";
import StreamingServices from "@/pages/StreamingServices";
import GameDetail from "@/pages/GameDetail";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <Switch>
      <Route path="/" component={Library} />
      <Route path="/new-releases" component={NewReleases} />
      <Route path="/upcoming" component={Upcoming} />
      <Route path="/library" component={Library} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/lists" component={Lists} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/services" component={StreamingServices} />
      <Route path="/game/:igdbId" component={GameDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <AuthWrapper style={style as React.CSSProperties}>
            <Router />
          </AuthWrapper>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function AuthWrapper({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading || !isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between gap-4 p-4 border-b border-border">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <GameSearchBar />
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default App;
