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

interface EventsResponse {
  events: Event[];
  metadata: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasMore: boolean;
  };
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);

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
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">Upcoming Events</h1>
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
  );
}
