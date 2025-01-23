"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Car, Shield, Ticket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Profile, Event } from "@/types/database";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const { session } = useAuth();
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    async function loadProfile() {
      if (!session?.user.id) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/profile");
        if (!response.ok) throw new Error("Failed to fetch profile");
        const profile = await response.json();

        setProfile(profile);
        form.reset({
          name: profile.name || "",
          email: profile.email,
          phone: profile.phone || "",
        });

        // Fetch upcoming events
        const eventsResponse = await fetch("/api/events/upcoming");
        if (eventsResponse.ok) {
          const { events } = await eventsResponse.json();
          setUpcomingEvents(events);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [session, router, form]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
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

  const formatDate = (date: string) => {
    return new Date(date)
      .toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase();
  };

  const formatTime = (date: string) => {
    return new Date(date)
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      })
      .toUpperCase();
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Account Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{profile?.name}</h2>
              <p className="text-gray-600">{profile?.email}</p>
              {profile?.phone && (
                <p className="text-gray-600">
                  •••-•••-{profile.phone.slice(-4)}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {isEditing ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <Link
                href="/my-tickets"
                className="block hover:bg-gray-50 p-3 rounded-md"
              >
                My Tickets
              </Link>
              <Link
                href="/my-listings"
                className="block hover:bg-gray-50 p-3 rounded-md"
              >
                My Listings
              </Link>
              <Link
                href="/favorites"
                className="block hover:bg-gray-50 p-3 rounded-md"
              >
                Favorites
              </Link>
              <Link
                href="/settings"
                className="block hover:bg-gray-50 p-3 rounded-md"
              >
                Settings
              </Link>
              <Link
                href="/payment-options"
                className="block hover:bg-gray-50 p-3 rounded-md"
              >
                Payment Options
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Events Section */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Next Event</h2>
            <Link href="/my-tickets" className="text-blue-600 hover:underline">
              See All Your Upcoming Events
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="relative aspect-[2/1]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.image_url || "/event-placeholder.jpg"}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded text-sm">
                    {formatDate(event.start_time)} •{" "}
                    {formatTime(event.start_time)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                  <p className="text-gray-600 mb-4">{event.venue?.name}</p>
                  <Button onClick={() => router.push(`/events/${event.id}`)}>
                    View Event Details
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-600">No upcoming events</p>
            </div>
          )}

          {/* Quick Tips Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <Car className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Parking Made Simple</h3>
              <p className="text-sm text-gray-600 mb-4">
                Save time and reserve parking in advance.
              </p>
              <Button variant="outline" className="w-full">
                Buy Parking
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <Shield className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Transfer Your Tickets</h3>
              <p className="text-sm text-gray-600 mb-4">
                The best way to meet your group at a live event.
              </p>
              <Button variant="outline" className="w-full">
                Transfer Tickets
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <Ticket className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="font-semibold mb-2">Sell Your Tickets</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have tickets and can&apos;t go? List your tickets to tons of
                buyers who need seats.
              </p>
              <Button variant="outline" className="w-full">
                Sell Tickets
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
