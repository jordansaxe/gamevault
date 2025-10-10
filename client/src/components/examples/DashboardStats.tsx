import { DashboardStats } from "../DashboardStats";

export default function DashboardStatsExample() {
  return (
    <DashboardStats
      totalGames={156}
      completedGames={42}
      hoursPlayed={328}
      wishlistCount={89}
    />
  );
}
