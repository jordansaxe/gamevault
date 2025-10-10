import { StatusBadge } from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="playing" />
      <StatusBadge status="completed" />
      <StatusBadge status="backlog" />
      <StatusBadge status="dropped" />
      <StatusBadge status="wishlist" />
    </div>
  );
}
