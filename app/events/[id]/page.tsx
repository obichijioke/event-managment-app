"use client";

import { useEffect, useState } from "react";
import { Event } from "@/types/database";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Facebook,
  Twitter,
  TicketIcon,
  Link as LinkIcon,
  Tag,
  Mail,
  Phone,
  Instagram,
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
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

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
      <div className="max-w-5xl mx-auto">
        {/* Main Cover Image */}
        {event.cover_image_url && (
          <div className="md:col-span-2 mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative aspect-video cursor-pointer rounded-lg overflow-hidden hover:opacity-95 transition-opacity md:h-[250px] h-[200px] w-full">
                  <Image
                    src={event.cover_image_url}
                    alt={event.name}
                    fill
                    className="object-cover "
                    priority
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="hidden">Cover Image</DialogTitle>
                </DialogHeader>
                <div className="relative aspect-video">
                  <Image
                    src={event.cover_image_url}
                    alt={event.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
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
        <div className="flex items-start gap-6 mb-8">
          {/* Date Box */}
          <div className="flex-shrink-0">
            <div className="w-24 text-center">
              <div className="bg-primary text-primary-foreground px-4 py-1 rounded-t-md uppercase text-sm font-medium">
                {format(new Date(event.start_time), "MMM")}
              </div>
              <div className="bg-muted px-4 py-3 rounded-b-md">
                <span className="text-3xl font-bold">
                  {format(new Date(event.start_time), "dd")}
                </span>
              </div>
            </div>
          </div>

          {/* Event Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span>
                  {format(new Date(event.start_time), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span>
                  {format(new Date(event.start_time), "h:mm a")} -{" "}
                  {format(new Date(event.end_time), "h:mm a")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{getLocationDisplay()}</span>
              </div>

              {event.category && (
                <div className="mt-2">
                  <Badge variant="secondary">
                    <Tag className="h-4 w-4 mr-2" />
                    {event.category.name}
                  </Badge>
                </div>
              )}
            </div>
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

            {/* Image Gallery Card */}
            {(event.cover_image_url ||
              (event.gallery_image_urls &&
                event.gallery_image_urls.length > 0)) && (
              <Card>
                <CardHeader>
                  <CardTitle>Event Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Gallery Images */}
                    {event.gallery_image_urls?.map((imageUrl, index) => (
                      <Dialog key={imageUrl}>
                        <DialogTrigger asChild>
                          <div className="relative aspect-video cursor-pointer rounded-lg overflow-hidden hover:opacity-95 transition-opacity">
                            <Image
                              src={imageUrl}
                              alt={`${event.name} gallery image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle className="hidden">
                              Gallery Image {index + 1}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="relative aspect-video">
                            <Image
                              src={imageUrl}
                              alt={`${event.name} gallery image ${index + 1}`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Ticket Information */}
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
                            {ticket.price === 0
                              ? "Free"
                              : `$${ticket.price.toFixed(2)}`}
                          </p>
                        </div>
                        <Button>
                          {ticket.price === 0 ? "Register" : "Get Tickets"}
                        </Button>
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
            {/* Organizer Card */}
            {event.organizer && (
              <Card>
                <CardHeader>
                  <CardTitle>Organizer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={
                          event.organizer.avatar_url ||
                          "/default-profile-photo.jpg"
                        }
                        alt={event.organizer.name || "Organizer"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {event.organizer.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Event Organizer
                      </p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    {event.organizer.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{event.organizer.phone}</span>
                      </div>
                    )}
                    {event.organizer.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{event.organizer.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4">
                    <Separator />
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="w-full" size="sm">
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        <Instagram className="h-4 w-4 mr-2" />
                        Instagram
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        <TicketIcon className="h-4 w-4 mr-2" />
                        TikTok
                      </Button>
                    </div>
                    <Button className="w-full" variant="secondary">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
