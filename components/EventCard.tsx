"use client";

import { Event } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, Clock, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const getTicketPriceDisplay = () => {
    if (!event.tickets || event.tickets.length === 0) {
      return "Tickets not available";
    }

    const prices = event.tickets.map((ticket) => ticket.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // If all tickets are free
    if (maxPrice === 0) {
      return "Free";
    }

    // If there are both free and paid tickets
    if (minPrice === 0) {
      return `From $${Math.min(...prices.filter((price) => price > 0)).toFixed(
        2
      )}`;
    }

    // If all tickets are paid and same price
    if (minPrice === maxPrice) {
      return `$${minPrice.toFixed(2)}`;
    }

    // If different paid ticket prices
    return `From $${minPrice.toFixed(2)}`;
  };

  const hasFreeTickets = event.tickets?.some((ticket) => ticket.price === 0);

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-video">
          <Image
            src={event.cover_image_url || "/event-placeholder.jpg"}
            alt={event.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
            {event.category && (
              <Badge variant="secondary" className="bg-white/90">
                <Tag className="h-3 w-3 mr-1" />
                {event.category.name}
              </Badge>
            )}
            {hasFreeTickets && (
              <Badge
                variant="default"
                className="bg-primary text-primary-foreground"
              >
                Free tickets available
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-xl font-semibold line-clamp-1 mb-2">
            {event.name}
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>
                {format(new Date(event.start_time), "EEEE, MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {format(new Date(event.start_time), "h:mm a")} -{" "}
                {format(new Date(event.end_time), "h:mm a")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4" />
              <span className="line-clamp-1">
                {event.is_online ? "Online Event" : event.venue?.name || "TBA"}
              </span>
            </div>
            <div className="mt-2 text-base font-semibold text-primary">
              {getTicketPriceDisplay()}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
