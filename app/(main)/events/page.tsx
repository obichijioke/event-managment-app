"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Event, Category } from "@/types/database";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventCard } from "@/components/EventCard";
import { Loader2, Search, CalendarDays, MapPin } from "lucide-react";
import { format, startOfToday, endOfMonth, addMonths } from "date-fns";

type EventFilters = {
  search?: string;
  category_id?: string;
  date?: string;
  location?: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<EventFilters>({
    search: searchParams.get("search") || "",
    category_id: searchParams.get("category_id") || "",
    date: searchParams.get("date") || "",
    location: searchParams.get("location") || "",
  });

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });

        const response = await fetch(`/api/events?${queryParams.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data.events);

        // Extract unique locations
        const uniqueLocations = Array.from(
          new Set(
            data.events.map((event: Event) => event.venue?.city).filter(Boolean)
          )
        ) as string[];

        setLocations(uniqueLocations);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [filters]);

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    router.push(`/events?search=${value}`);
  };

  const handleFilterChange = (key: keyof EventFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/events?${params.toString()}`);
  };

  const dateOptions = [
    {
      label: "Any Date",
      value: "",
    },
    {
      label: "Today",
      value: format(startOfToday(), "yyyy-MM-dd"),
    },
    {
      label: "This Month",
      value: `${format(startOfToday(), "yyyy-MM-dd")}:${format(
        endOfMonth(new Date()),
        "yyyy-MM-dd"
      )}`,
    },
    {
      label: "Next Month",
      value: `${format(startOfToday(), "yyyy-MM-dd")}:${format(
        endOfMonth(addMonths(new Date(), 1)),
        "yyyy-MM-dd"
      )}`,
    },
  ];

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search events..."
            className="pl-10"
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Select
            value={filters.category_id}
            onValueChange={(value) =>
              handleFilterChange("category_id", value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <CalendarDays className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.date}
            onValueChange={(value) =>
              handleFilterChange("date", value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <CalendarDays className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              {dateOptions.map((option) => (
                <SelectItem key={option.value} value={option.value || "all"}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.location}
            onValueChange={(value) =>
              handleFilterChange("location", value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <MapPin className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No events found</h3>
          <p className="text-gray-600">
            Try adjusting your filters or search criteria
          </p>
        </div>
      )}
    </div>
  );
}
