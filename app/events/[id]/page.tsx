"use client";

import { useEffect, useState } from "react";
import { Event } from "@/types/database";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowLeft,
  Facebook,
  Twitter,
  Link as LinkIcon,
  Tag,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        const response = await fetch(`/api/events/${params.id}`);
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Event not found"
              : "Failed to fetch event details"
          );
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEventDetails();
  }, [params.id]);

  // Load Google Maps script
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
  //   script.async = true;
  //   script.defer = true;
  //   document.head.appendChild(script);

  //   return () => {
  //     document.head.removeChild(script);
  //   };
  // }, []);

  const handleShare = async (platform: string) => {
    const eventUrl = window.location.href;
    const eventTitle = event?.name;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            eventUrl
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            eventUrl
          )}&text=${encodeURIComponent(`Check out ${eventTitle}!`)}`,
          "_blank"
        );
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(eventUrl);
          setShowCopiedTooltip(true);
          setTimeout(() => setShowCopiedTooltip(false), 2000);
        } catch (err) {
          console.error("Failed to copy URL:", err);
        }
        break;
    }
  };

  const getLocationDisplay = () => {
    if (event?.is_online) {
      return "Online Event";
    }
    if (event?.venue) {
      return `${event.venue.name}, ${event.venue.address}, ${event.venue.city}, ${event.venue.state} ${event.venue.postal_code}`;
    }
    return "TBA";
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

  if (!event) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation and Share */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            className="px-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleShare("facebook")}
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share on Facebook</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleShare("twitter")}
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share on Twitter</TooltipContent>
              </Tooltip>
              <Tooltip open={showCopiedTooltip}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleShare("copy")}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {showCopiedTooltip ? "Copied!" : "Copy Link"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Event Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{event.name}</h1>
          {event.category && (
            <div className="mb-4">
              <Badge variant="secondary">
                <Tag className="h-4 w-4 mr-2" />
                {event.category.name}
              </Badge>
            </div>
          )}
          <div className="flex flex-wrap gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>
                {format(new Date(event.start_time), "EEEE, MMMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>
                {format(new Date(event.start_time), "h:mm a")} -{" "}
                {format(new Date(event.end_time), "h:mm a")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{getLocationDisplay()}</span>
            </div>
            {event.organizer && (
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Organized by {event.organizer.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Event Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About this event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {event.description.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Map Card - Only show if it's not an online event */}
            {!event.is_online && event.venue && (
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                  <CardDescription>{getLocationDisplay()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] rounded-md overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=${
                        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                      }&q=${encodeURIComponent(getLocationDisplay())}`}
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Ticket Information */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Tickets</CardTitle>
                <CardDescription>Select your ticket type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {event.tickets && event.tickets.length > 0 ? (
                    event.tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold">{ticket.name}</p>
                          <p className="text-sm text-gray-500">
                            ${ticket.price.toFixed(2)}
                          </p>
                        </div>
                        <Button>Get Tickets</Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      No tickets available yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Event Information */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Date and Time</h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(event.start_time), "EEEE, MMMM d, yyyy")}
                    <br />
                    {format(new Date(event.start_time), "h:mm a")} -{" "}
                    {format(new Date(event.end_time), "h:mm a")}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    {event.is_online ? "Online Event" : "Location"}
                  </h3>
                  {event.is_online ? (
                    <p className="text-sm text-gray-600">
                      {event.online_url || "Link will be provided"}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      {getLocationDisplay()}
                    </p>
                  )}
                </div>
                {event.organizer && (
                  <div>
                    <h3 className="font-semibold mb-1">Organizer</h3>
                    <p className="text-sm text-gray-600">
                      {event.organizer.name}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
