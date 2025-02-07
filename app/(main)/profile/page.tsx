"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Car,
  Shield,
  Ticket,
  X,
  Pencil,
  List,
  Heart,
  Settings,
  ArrowRight,
  Calendar,
} from "lucide-react";
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold  text-gray-900 bg-clip-text mb-12">
        Account Overview
      </h1>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Profile Section - Now a sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-600">
                    {profile?.name?.[0]}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {profile?.name}
                </h2>
                <p className="text-gray-600 text-sm">{profile?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-full px-6 border border-blue-200 hover:bg-blue-50"
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Profile
                  </>
                )}
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
                          <Input
                            className="rounded-xl"
                            placeholder="Enter your name"
                            {...field}
                          />
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
                            className="rounded-xl"
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
                            className="rounded-xl"
                            type="tel"
                            placeholder="Enter your phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/my-tickets"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  <Ticket className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">My Tickets</span>
                </Link>
                <Link
                  href="/my-listings"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  <List className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">My Listings</span>
                </Link>
                <Link
                  href="/favorites"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  <Heart className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Favorites</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Settings</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Upcoming Events Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
              <Link
                href="/my-tickets"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="grid gap-6">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="group relative overflow-hidden rounded-xl border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={event.cover_image_url || "/event-placeholder.jpg"}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-4">
                        <h3 className="text-xl font-bold text-white">
                          {event.name}
                        </h3>
                        <p className="text-gray-200 text-sm">
                          {event.venue?.name}
                        </p>
                      </div>
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm">
                        {formatDate(event.start_time)}
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <Button
                        className="w-full rounded-xl"
                        onClick={() => router.push(`/events/${event.id}`)}
                      >
                        View Event Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-xl bg-gray-50">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No upcoming events found</p>
              </div>
            )}
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Car,
                title: "Parking Passes",
                text: "Reserve parking for your next event",
                action: "Buy Parking",
              },
              {
                icon: Shield,
                title: "Transfer Tickets",
                text: "Safely transfer tickets to friends",
                action: "Transfer Now",
              },
              {
                icon: Ticket,
                title: "Sell Tickets",
                text: "Can't make it? List your tickets",
                action: "Start Selling",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <item.icon className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.text}</p>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  {item.action}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
