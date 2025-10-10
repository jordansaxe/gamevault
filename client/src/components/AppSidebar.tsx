import { 
  Sparkles,
  Clock,
  Library, 
  ListPlus,
  Heart,
  Calendar, 
  Tv,
  Settings,
  Gamepad2,
  ChevronRight,
  CheckCircle,
  TrendingUp,
  Timer
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLocation } from "wouter";

const mainMenuItems = [
  { title: "New Releases", url: "/new-releases", icon: Sparkles, testId: "nav-new-releases" },
  { title: "Upcoming", url: "/upcoming", icon: Clock, testId: "nav-upcoming" },
  { title: "My Library", url: "/library", icon: Library, testId: "nav-library" },
  { title: "Wishlist", url: "/wishlist", icon: Heart, testId: "nav-wishlist" },
  { title: "Events Calendar", url: "/events", icon: Calendar, testId: "nav-events" },
  { title: "Streaming Services", url: "/services", icon: Tv, testId: "nav-services" },
];

const listSubItems = [
  { title: "Total Games", url: "/lists/all", icon: Gamepad2, testId: "nav-list-all" },
  { title: "New Releases", url: "/lists/new-releases", icon: TrendingUp, testId: "nav-list-new" },
  { title: "Upcoming", url: "/lists/upcoming", icon: Timer, testId: "nav-list-upcoming" },
  { title: "Completed", url: "/lists/completed", icon: CheckCircle, testId: "nav-list-completed" },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-display font-semibold">GameTracker</h1>
        </div>
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

              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton data-testid="nav-lists">
                      <ListPlus className="h-4 w-4" />
                      <span>Lists</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {listSubItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isActive = location === subItem.url;
                        
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                              asChild 
                              isActive={isActive}
                              data-testid={subItem.testId}
                            >
                              <a href={subItem.url}>
                                <SubIcon className="h-4 w-4" />
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
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
