"use client";

import { useEffect, useState } from "react";
import { Event } from "@/types/database";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "use-debounce";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HeroSection } from "@/components/HeroSection";
import Link from "next/link";
import {
  Music,
  PartyPopper,
  Theater,
  Calendar,
  Heart,
  Gamepad2,
  Briefcase,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EventsResponse {
  events: Event[];
  metadata: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasMore: boolean;
  };
}

const categories = [
  {
    name: "Music",
    icon: Music,
    href: "/events?category=music",
    color: "hover:bg-purple-100 hover:text-purple-600 hover:border-purple-300",
    iconColor: "group-hover:text-purple-600",
  },
  {
    name: "Nightlife",
    icon: PartyPopper,
    href: "/events?category=nightlife",
    color: "hover:bg-pink-100 hover:text-pink-600 hover:border-pink-300",
    iconColor: "group-hover:text-pink-600",
  },
  {
    name: "Performing & Visual Arts",
    icon: Theater,
    href: "/events?category=arts",
    color: "hover:bg-indigo-100 hover:text-indigo-600 hover:border-indigo-300",
    iconColor: "group-hover:text-indigo-600",
  },
  {
    name: "Holidays",
    icon: Calendar,
    href: "/events?category=holidays",
    color: "hover:bg-red-100 hover:text-red-600 hover:border-red-300",
    iconColor: "group-hover:text-red-600",
  },
  {
    name: "Dating",
    icon: Heart,
    href: "/events?category=dating",
    color: "hover:bg-rose-100 hover:text-rose-600 hover:border-rose-300",
    iconColor: "group-hover:text-rose-600",
  },
  {
    name: "Hobbies",
    icon: Gamepad2,
    href: "/events?category=hobbies",
    color: "hover:bg-green-100 hover:text-green-600 hover:border-green-300",
    iconColor: "group-hover:text-green-600",
  },
  {
    name: "Business",
    icon: Briefcase,
    href: "/events?category=business",
    color: "hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300",
    iconColor: "group-hover:text-blue-600",
  },
  {
    name: "Food & Drink",
    icon: UtensilsCrossed,
    href: "/events?category=food-and-drink",
    color: "hover:bg-orange-100 hover:text-orange-600 hover:border-orange-300",
    iconColor: "group-hover:text-orange-600",
  },
];

const hostSteps = [
  {
    step: "01",
    title: "Create Event",
    description: "Create your event page in just a few clicks",
    content: {
      title: "Easy Event Creation",
      description:
        "Create a professional event page in minutes with our user-friendly tools",
      features: [
        {
          title: "Quick Sign Up",
          description: "Get started in seconds with Google, Facebook, or email",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          ),
          color: "blue",
        },
        {
          title: "Ready-Made Templates",
          description: "Choose from beautiful, pre-designed event page layouts",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          ),
          color: "purple",
        },
        {
          title: "Easy Customization",
          description:
            "Add your photos, branding, and event details with simple editing tools",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          ),
          color: "green",
        },
      ],
    },
  },
  {
    step: "02",
    title: "Set Up Tickets",
    description: "Create tickets and start selling instantly",
    content: {
      title: "Simple Ticket Management",
      description:
        "Set up your ticket types and pricing in minutes with our easy-to-use tools",
      features: [
        {
          title: "Flexible Ticket Types",
          description:
            "Create multiple ticket tiers: VIP, Early Bird, General Admission, or Free",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
            />
          ),
          color: "indigo",
        },
        {
          title: "Safe Payments",
          description:
            "Receive payments directly to your account with secure processing",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          ),
          color: "emerald",
        },
        {
          title: "Smart Pricing",
          description: "Set up early-bird rates and promo codes to boost sales",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          ),
          color: "rose",
        },
      ],
    },
  },
  {
    step: "03",
    title: "Host Event",
    description: "Manage your event with powerful tools",
    content: {
      title: "Seamless Event Management",
      description:
        "Everything you need to run your event smoothly in one place",
      features: [
        {
          title: "Guest List",
          description: "View and manage attendees with our simple dashboard",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          ),
          color: "cyan",
        },
        {
          title: "Quick Check-in",
          description: "Speed up entry with our mobile check-in app",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          ),
          color: "violet",
        },
        {
          title: "Event Updates",
          description: "Keep attendees informed with instant notifications",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          ),
          color: "amber",
        },
      ],
    },
  },
  {
    step: "04",
    title: "Grow Events",
    description: "Track success and expand your reach",
    content: {
      title: "Measure & Improve",
      description:
        "Use data-driven insights to make your next event even better",
      features: [
        {
          title: "Sales Reports",
          description: "Track ticket sales and revenue in real-time",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          ),
          color: "blue",
        },
        {
          title: "Guest Feedback",
          description: "Get valuable insights from attendee surveys",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          ),
          color: "purple",
        },
        {
          title: "Promotion Tools",
          description:
            "Boost ticket sales with social media and email marketing",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            />
          ),
          color: "green",
        },
      ],
    },
  },
];

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [activeStep, setActiveStep] = useState(0);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const limit = 12;
  const sortBy = searchParams.get("sortBy") || "date";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
        });

        if (debouncedSearch) {
          params.append("search", debouncedSearch);
        }

        const response = await fetch(`/api/events?${params}`);
        if (!response.ok) throw new Error("Failed to fetch events");

        const data: EventsResponse = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [page, debouncedSearch, sortBy, sortOrder]);

  function handleSearch(value: string) {
    setSearchQuery(value);
    // Reset to first page when searching
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSort(value: string) {
    const [newSortBy, newSortOrder] = value.split("-");
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", newSortBy);
    params.set("sortOrder", newSortOrder);
    params.set("page", "1"); // Reset to first page when sorting changes
    router.push(`${pathname}?${params.toString()}`);
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <main>
      <HeroSection />

      {/* Category Icons */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:w-4/5 lg:w-3/5">
          <h2 className="text-2xl font-bold text-center mb-8">
            Browse Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group flex flex-col items-center gap-3 relative"
              >
                <div
                  className={cn(
                    "w-20 h-20 rounded-2xl bg-white flex items-center justify-center",
                    "border-2 border-border shadow-sm",
                    "transform transition-all duration-300",
                    "group-hover:scale-110 group-hover:shadow-md",
                    category.color
                  )}
                >
                  <category.icon
                    className={cn(
                      "w-10 h-10 text-muted-foreground transition-all duration-300",
                      category.iconColor
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-sm font-medium text-muted-foreground",
                    "transition-all duration-300",
                    "group-hover:text-foreground"
                  )}
                >
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">
            Upcoming Events
          </h1>
          <div className="w-full max-w-md space-y-4">
            <Input
              type="search"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSort}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-asc">Date (Earliest first)</SelectItem>
                <SelectItem value="date-desc">Date (Latest first)</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePageChange(page + 1)}
                disabled={events.length < limit}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 min-h-[400px] flex items-center justify-center">
            No events found
          </div>
        )}
      </div>
      {/* How to Host Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 md:w-4/5 lg:w-3/4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Be a Star Event Host in 4 Easy Steps
            </h2>
            <p className="text-muted-foreground">
              Use early-bird discounts, coupons and group ticketing to double
              your ticket sale. Get paid quickly and securely.
            </p>
          </div>

          {/* Steps Tabs */}
          <div className="relative">
            {/* Tab Headers */}
            <div className="grid grid-cols-4 mb-8">
              {hostSteps.map((step, index) => (
                <div key={step.step} className="relative">
                  <button
                    onClick={() => setActiveStep(index)}
                    className={cn(
                      "w-full text-center p-4 transition-colors",
                      index === activeStep
                        ? "bg-[#8BC34A] text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    <div className="font-semibold mb-1">Step {step.step}</div>
                    <div className="text-sm">{step.title}</div>
                  </button>
                </div>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">
                  {hostSteps[activeStep].content.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {hostSteps[activeStep].content.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {hostSteps[activeStep].content.features.map(
                    (feature, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center text-center"
                      >
                        <div
                          className={`w-16 h-16 bg-${feature.color}-100 rounded-full flex items-center justify-center mb-4`}
                        >
                          <svg
                            className={`w-8 h-8 text-${feature.color}-600`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            {feature.icon}
                          </svg>
                        </div>
                        <h4 className="font-semibold mb-2">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="text-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#8BC34A] hover:bg-[#7CB342] text-white"
                >
                  <Link href="/organizer/events/new">
                    Create Your First Event
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
