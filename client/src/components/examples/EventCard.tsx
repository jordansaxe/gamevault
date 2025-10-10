import { EventCard } from "../EventCard";

export default function EventCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <EventCard
        id="1"
        name="Summer Game Fest 2025"
        date="June 8, 2025"
        description="The biggest gaming announcements of the summer"
        imageUrl="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop"
        gameCount={42}
      />
      <EventCard
        id="2"
        name="The Game Awards"
        date="December 12, 2025"
        description="Celebrating the best games of the year"
        imageUrl="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop"
        gameCount={28}
      />
    </div>
  );
}
