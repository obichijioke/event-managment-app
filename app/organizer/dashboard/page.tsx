"use client";

import { useEffect, useState } from "react";
import { Event } from "@/types/database";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Loader2, Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Package,
  Users,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Ticket = {
  id: string;
  price: number;
};

type EventWithTickets = Event & {
  tickets?: Ticket[];
};

// Sample data for the graph
const data = [
  { name: "Mon", value: 4 },
  { name: "Tue", value: 8 },
  { name: "Wed", value: 6 },
  { name: "Thu", value: 7 },
  { name: "Fri", value: 6 },
  { name: "Sat", value: 4 },
  { name: "Sun", value: 8 },
];

export default function DashboardPage() {
  const [events, setEvents] = useState<EventWithTickets[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState(
    "1st April, 2022 - 30th April, 2022"
  );
  const router = useRouter();

  useEffect(() => {
    async function fetchOrganizerEvents() {
      try {
        const response = await fetch("/api/organizer/events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();

        // Fetch tickets for each event
        const eventsWithTickets = await Promise.all(
          data.events.map(async (event: Event) => {
            const ticketsResponse = await fetch(
              `/api/organizer/events/${event.id}/tickets`
            );
            if (ticketsResponse.ok) {
              const { tickets } = await ticketsResponse.json();
              return { ...event, tickets };
            }
            return { ...event, tickets: [] };
          })
        );

        setEvents(eventsWithTickets);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrganizerEvents();
  }, []);

  const getTicketPriceDisplay = (event: EventWithTickets) => {
    if (!event.tickets || event.tickets.length === 0) {
      return "No tickets";
    }

    const prices = event.tickets.map((ticket) => ticket.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return `$${minPrice.toFixed(2)}`;
    }

    return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
  };

  const handleStatusChange = async (
    eventId: string,
    newStatus: "draft" | "published" | "cancelled"
  ) => {
    try {
      const response = await fetch(`/api/organizer/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update event status");

      // Update local state
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId ? { ...event, status: newStatus } : event
        )
      );
    } catch (error) {
      console.error("Error updating event status:", error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`/api/organizer/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete event");

      // Remove event from local state
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleDateChange = (direction: "prev" | "next") => {
    // This is a placeholder function that would normally calculate the actual date range
    if (direction === "prev") {
      setDateRange("1st March, 2022 - 31st March, 2022");
    } else {
      setDateRange("1st May, 2022 - 31st May, 2022");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200"></div>
          <div>
            <h2 className="text-xl font-semibold">John Doe</h2>
            <p className="text-sm text-muted-foreground">My Organisation</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <span className="text-sm">Add Organisation</span>
        </Button>
      </div>

      {/* Date Navigation */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDateChange("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDateChange("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm">{dateRange}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Selected Events (1)
          </span>
          <Select defaultValue="monthly">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-[#8B5CF6] text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">REVENUE (AUD)</h3>
            <DollarSign className="h-6 w-6 opacity-75" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold">$550.00</p>
            <p className="text-sm opacity-75">0.00% From Previous Period</p>
          </div>
        </Card>

        <Card className="p-6 bg-[#F87171] text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">ORDERS</h3>
            <Package className="h-6 w-6 opacity-75" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold">2</p>
            <p className="text-sm opacity-75">0.00% From Previous Period</p>
          </div>
        </Card>

        <Card className="p-6 bg-[#60A5FA] text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">PAGE VIEWS</h3>
            <Eye className="h-6 w-6 opacity-75" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold">30</p>
            <p className="text-sm opacity-75">0.00% From Previous Period</p>
          </div>
        </Card>

        <Card className="p-6 bg-[#4ADE80] text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">TICKET SALES</h3>
            <Users className="h-6 w-6 opacity-75" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm opacity-75">0.00% From Previous Period</p>
          </div>
        </Card>
      </div>

      {/* Revenue Graph */}
      <Card className="p-6">
        <div className="mb-4">
          <Select defaultValue="revenue">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="pageViews">Page Views</SelectItem>
              <SelectItem value="ticketSales">Ticket Sales</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-2">
            See the graphical representation below
          </p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8BC34A"
                strokeWidth={2}
                dot={{ fill: "#8BC34A" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your events</p>
            </div>
            <Button onClick={() => router.push("/organizer/events/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>

          <div className="grid gap-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Events</CardTitle>
                  <CardDescription>All your events</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{events.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Published Events</CardTitle>
                  <CardDescription>Live and visible to public</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {events.filter((e) => e.status === "published").length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Draft Events</CardTitle>
                  <CardDescription>Work in progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {events.filter((e) => e.status === "draft").length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Events Table */}
            <Card>
              <CardHeader>
                <CardTitle>Your Events</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ticket Prices</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">
                          {event.name}
                        </TableCell>
                        <TableCell>
                          {format(new Date(event.start_time), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              event.status === "published"
                                ? "default"
                                : event.status === "draft"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {event.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{getTicketPriceDisplay(event)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/organizer/events/${event.id}`)
                                }
                              >
                                Edit Event
                              </DropdownMenuItem>
                              {event.status === "draft" ? (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(event.id, "published")
                                  }
                                >
                                  Publish Event
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(event.id, "draft")
                                  }
                                >
                                  Unpublish Event
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                Delete Event
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
