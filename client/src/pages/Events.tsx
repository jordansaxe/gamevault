import { EventCard } from "@/components/EventCard";
import { Calendar as CalendarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

//todo: remove mock functionality
const upcomingEvents = [
  {
    id: "1",
    name: "Summer Game Fest 2025",
    date: "June 8, 2025",
    description: "The biggest gaming announcements of the summer",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop",
    gameCount: 42,
  },
  {
    id: "2",
    name: "State of Play",
    date: "May 15, 2025",
    description: "PlayStation's showcase of upcoming titles",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
    gameCount: 18,
  },
  {
    id: "3",
    name: "Xbox Games Showcase",
    date: "June 10, 2025",
    description: "Microsoft's annual gaming event",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop",
    gameCount: 25,
  },
];

const pastEvents = [
  {
    id: "4",
    name: "The Game Awards 2024",
    date: "December 12, 2024",
    description: "Celebrating the best games of the year",
    imageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=400&fit=crop",
    gameCount: 35,
  },
  {
    id: "5",
    name: "Nintendo Direct",
    date: "March 5, 2024",
    description: "Nintendo's latest announcements",
    imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=400&fit=crop",
    gameCount: 22,
  },
];

export default function Events() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-semibold flex items-center gap-2" data-testid="text-events-title">
          <CalendarIcon className="h-8 w-8 text-primary" />
          Gaming Events Calendar
        </h1>
        <p className="text-muted-foreground mt-1">
          Track major gaming events and discover announced titles
        </p>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming" data-testid="tab-upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past" data-testid="tab-past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
