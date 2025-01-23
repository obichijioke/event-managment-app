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

type Ticket = {
  id: string;
  price: number;
};

type EventWithTickets = Event & {
  tickets?: Ticket[];
};

export default function OrganizerDashboard() {
  const [events, setEvents] = useState<EventWithTickets[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  );
}
