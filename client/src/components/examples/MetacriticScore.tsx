import { MetacriticScore } from "../MetacriticScore";

export default function MetacriticScoreExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <MetacriticScore score={92} />
      <MetacriticScore score={68} />
      <MetacriticScore score={45} />
    </div>
  );
}
