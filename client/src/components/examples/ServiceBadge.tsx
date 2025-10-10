import { ServiceBadge } from "../ServiceBadge";

export default function ServiceBadgeExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <ServiceBadge service="ps-plus" tier="Extra" />
      <ServiceBadge service="game-pass" tier="Ultimate" />
      <ServiceBadge service="apple-arcade" />
      <ServiceBadge service="geforce-now" />
    </div>
  );
}
