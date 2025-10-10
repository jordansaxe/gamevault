import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, CheckCircle, Clock, Heart } from "lucide-react";

interface DashboardStatsProps {
  totalGames: number;
  completedGames: number;
  hoursPlayed: number;
  wishlistCount: number;
}

export function DashboardStats({ 
  totalGames, 
  completedGames, 
  hoursPlayed, 
  wishlistCount 
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Games",
      value: totalGames,
      icon: Gamepad2,
      testId: "stat-total-games"
    },
    {
      title: "Completed",
      value: completedGames,
      icon: CheckCircle,
      testId: "stat-completed"
    },
    {
      title: "Hours Played",
      value: hoursPlayed,
      icon: Clock,
      testId: "stat-hours"
    },
    {
      title: "Wishlist",
      value: wishlistCount,
      icon: Heart,
      testId: "stat-wishlist"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} data-testid={stat.testId}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-display" data-testid={`${stat.testId}-value`}>
                {stat.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
