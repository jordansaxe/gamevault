import { Badge } from "@/components/ui/badge";

interface MetacriticScoreProps {
  score: number;
}

export function MetacriticScore({ score }: MetacriticScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 75) return "bg-green-600 hover:bg-green-700 border-transparent text-white";
    if (score >= 50) return "bg-yellow-600 hover:bg-yellow-700 border-transparent text-white";
    return "bg-red-600 hover:bg-red-700 border-transparent text-white";
  };

  return (
    <Badge 
      className={`text-xs font-bold ${getScoreColor(score)}`}
      data-testid="badge-metacritic"
    >
      {score}
    </Badge>
  );
}
