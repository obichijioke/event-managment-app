"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Loader2, Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { VenueSelector } from "@/components/VenueSelector";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const eventFormSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().min(1, "Description is required"),
  venue_id: z.string().min(1, "Venue is required"),
  start_time: z.date({
    required_error: "Start time is required",
  }),
  end_time: z.date({
    required_error: "End time is required",
  }),
  category: z.string().min(1, "Category is required"),
  image_url: z.string().optional(),
  is_online: z.boolean().default(false),
  online_url: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

type Venue = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
};

type Ticket = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  quantity_available: number;
  sale_start_time: string | null;
  sale_end_time: string | null;
};

type Event = {
  id: string;
  name: string;
  description: string;
  venue_id: string;
  start_time: string;
  end_time: string;
  category: string;
  image_url: string | null;
  is_online: boolean;
  online_url: string | null;
  status: "draft" | "published" | "cancelled";
  venue: Venue;
};

interface EventPageClientProps {
  eventId: string;
}

export default function EventPageClient({ eventId }: EventPageClientProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const router = useRouter();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
  });

  useEffect(() => {
    async function fetchEventAndTickets() {
      try {
        // Fetch event details
        const eventResponse = await fetch(`/api/organizer/events/${eventId}`);
        if (!eventResponse.ok) throw new Error("Failed to fetch event");
        const eventData = await eventResponse.json();
        setEvent(eventData);
        setSelectedVenue(eventData.venue);

        // Set form default values
        form.reset({
          name: eventData.name,
          description: eventData.description,
          venue_id: eventData.venue_id,
          start_time: new Date(eventData.start_time),
          end_time: new Date(eventData.end_time),
          category: eventData.category,
          image_url: eventData.image_url || "",
          is_online: eventData.is_online,
          online_url: eventData.online_url || "",
        });

        // Fetch tickets
        const ticketsResponse = await fetch(
          `/api/organizer/events/${eventId}/tickets`
        );
        if (!ticketsResponse.ok) throw new Error("Failed to fetch tickets");
        const { tickets } = await ticketsResponse.json();
        setTickets(tickets);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEventAndTickets();
  }, [eventId, form]);

  async function onSubmit(data: EventFormValues) {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/organizer/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(
    newStatus: "draft" | "published" | "cancelled"
  ) {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/organizer/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update event status");

      const updatedEvent = await response.json();
      setEvent(updatedEvent);
    } catch (error) {
      console.error("Error updating event status:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">Event not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{event.name}</h1>
            <div className="flex items-center gap-2 mt-2">
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
              {event.is_online && <Badge variant="outline">Online Event</Badge>}
            </div>
          </div>
          <div className="flex gap-2">
            {event.status === "draft" ? (
              <Button onClick={() => handleStatusChange("published")}>
                Publish Event
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => handleStatusChange("draft")}
              >
                Unpublish
              </Button>
            )}
            <Button
              variant={isEditing ? "ghost" : "secondary"}
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel Edit" : "Edit Event"}
            </Button>
          </div>
        </div>

        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter event description"
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="venue_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue</FormLabel>
                    <FormControl>
                      <VenueSelector
                        selectedVenue={selectedVenue}
                        onVenueSelect={(venue) => {
                          setSelectedVenue(venue);
                          field.onChange(venue?.id || "");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_online"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Online Event</FormLabel>
                      <FormDescription>
                        Check this if this is an online event
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("is_online") && (
                <FormField
                  control={form.control}
                  name="online_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Online Event URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Description</h3>
                  <p className="text-gray-600">{event.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Category</h3>
                  <p className="text-gray-600">{event.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Date and Time</h3>
                  <p className="text-gray-600">
                    {format(new Date(event.start_time), "PPP")} at{" "}
                    {format(new Date(event.start_time), "p")} to{" "}
                    {format(new Date(event.end_time), "p")}
                  </p>
                </div>
                {event.is_online ? (
                  <div>
                    <h3 className="font-semibold mb-1">Online Event URL</h3>
                    <p className="text-gray-600">{event.online_url}</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold mb-1">Venue</h3>
                    <p className="text-gray-600">
                      {event.venue.name}
                      <br />
                      {event.venue.address}
                      <br />
                      {event.venue.city}, {event.venue.state}{" "}
                      {event.venue.postal_code}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Tickets</CardTitle>
                  <Button onClick={() => router.push(`${eventId}/tickets/new`)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Ticket Type
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No tickets created yet
                    </p>
                  ) : (
                    tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex justify-between items-center p-4 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-semibold">{ticket.name}</h4>
                          <p className="text-sm text-gray-500">
                            {ticket.description}
                          </p>
                          <p className="text-sm font-medium mt-1">
                            ${ticket.price.toFixed(2)} ·{" "}
                            {ticket.quantity_available} available
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`${eventId}/tickets/${ticket.id}/edit`)
                          }
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
