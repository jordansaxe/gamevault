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
import NewReleases from "@/pages/NewReleases";
import Upcoming from "@/pages/Upcoming";
import Library from "@/pages/Library";
import Wishlist from "@/pages/Wishlist";
import Lists from "@/pages/Lists";
import Events from "@/pages/Events";
import StreamingServices from "@/pages/StreamingServices";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={NewReleases} />
      <Route path="/new-releases" component={NewReleases} />
      <Route path="/upcoming" component={Upcoming} />
      <Route path="/library" component={Library} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/lists" component={Lists} />
      <Route path="/events" component={Events} />
      <Route path="/services" component={StreamingServices} />
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
          <SidebarProvider style={style as React.CSSProperties}>
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
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
