import { 
  Sparkles,
  Clock,
  Library, 
  ListPlus,
  Heart,
  Calendar, 
  Settings,
  Gamepad2
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";

const mainMenuItems = [
  { title: "New Releases", url: "/new-releases", icon: Sparkles, testId: "nav-new-releases" },
  { title: "Upcoming", url: "/upcoming", icon: Clock, testId: "nav-upcoming" },
  { title: "My Library", url: "/library", icon: Library, testId: "nav-library" },
  { title: "Wishlist", url: "/wishlist", icon: Heart, testId: "nav-wishlist" },
  { title: "Lists", url: "/lists", icon: ListPlus, testId: "nav-lists" },
  { title: "Calendar", url: "/calendar", icon: Calendar, testId: "nav-calendar" },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <a href="/new-releases" className="flex items-center gap-2 hover-elevate rounded-md transition-all" data-testid="link-home">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-display font-semibold">GameTracker</h1>
        </a>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.url;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      data-testid={item.testId}
                    >
                      <a href={item.url}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild data-testid="nav-settings">
              <a href="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
