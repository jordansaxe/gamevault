import { AppSidebar } from "../AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppSidebarExample() {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <div className="flex-1 p-8 bg-background">
          <h2 className="text-2xl font-display font-semibold">Sidebar Navigation</h2>
          <p className="text-muted-foreground mt-2">Click the menu items to navigate</p>
        </div>
      </div>
    </SidebarProvider>
  );
}
