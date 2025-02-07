"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Loader2,
  MoreVertical,
  Ticket,
  Clock,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Event {
  id: string;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  cover_image_url: string | null;
  status: "draft" | "published" | "cancelled";
  venue?: {
    name: string;
    address: string;
  } | null;
  organizer?: {
    id: string;
    name: string;
    email: string;
  } | null;
  tickets?: {
    id: string;
    price: number;
    quantity_available: number;
  }[];
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewEvent, setPreviewEvent] = useState<Event | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/organizer/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data.events);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePreview = (event: Event) => {
    setPreviewEvent(event);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button className="bg-[#8BC34A] hover:bg-[#7CB342]">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#8BC34A]" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <p className="text-gray-500 text-center">
              {searchQuery
                ? "No events found matching your search."
                : "No events found. Create your first event!"}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y">
          {filteredEvents.map((event) => (
            <div key={event.id} className="p-6 flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={event.cover_image_url || "/event-placeholder.jpg"}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold truncate">
                    {event.name}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {event.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.start_time)}</span>
                  </div>
                  {event.venue && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{event.venue.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Ticket className="h-4 w-4" />
                    <span>
                      {event.tickets?.reduce(
                        (total, ticket) =>
                          total + (ticket.quantity_available || 0),
                        0
                      ) || 0}
                      /{event.tickets?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(event)}
                >
                  Preview Event
                </Button>
                <Button variant="outline" size="sm">
                  Duplicate
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Manage Event</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePreview(event)}>
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!previewEvent} onOpenChange={() => setPreviewEvent(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Event Preview</DialogTitle>
          </DialogHeader>
          {previewEvent && (
            <div className="mt-4">
              <div className="aspect-video rounded-lg overflow-hidden mb-6">
                <img
                  src={previewEvent.cover_image_url || "/event-placeholder.jpg"}
                  alt={previewEvent.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{previewEvent.name}</h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        previewEvent.status
                      )}`}
                    >
                      {previewEvent.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{previewEvent.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Date & Time</h3>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(previewEvent.start_time)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {formatTime(previewEvent.start_time)} -{" "}
                            {formatTime(previewEvent.end_time)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Location</h3>
                      {previewEvent.venue ? (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <div>
                            <div>{previewEvent.venue.name}</div>
                            <div className="text-sm">
                              {previewEvent.venue.address}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">No venue specified</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Ticket Types</h3>
                    <div className="space-y-3">
                      {previewEvent.tickets &&
                      previewEvent.tickets.length > 0 ? (
                        previewEvent.tickets.map((ticket) => (
                          <div
                            key={ticket.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <Ticket className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="font-medium">
                                  General Admission
                                </div>
                                <div className="text-sm text-gray-500">
                                  {ticket.quantity_available} available
                                </div>
                              </div>
                            </div>
                            <div className="font-semibold">
                              <DollarSign className="h-4 w-4 inline" />
                              {ticket.price}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No tickets available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
