"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const venueFormSchema = z.object({
  name: z.string().min(1, "Venue name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),
});

type VenueFormValues = z.infer<typeof venueFormSchema>;

type Venue = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
};

interface VenueSelectorProps {
  onVenueSelect: (venue: Venue | null) => void;
  selectedVenue?: Venue | null;
}

export function VenueSelector({
  onVenueSelect,
  selectedVenue,
}: VenueSelectorProps) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
    },
  });

  async function searchVenues(query: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from("venues")
      .select("*")
      .ilike("name", `%${query}%`)
      .limit(5);

    if (data) {
      setVenues(data);
    }
  }

  async function onSubmit(data: VenueFormValues) {
    try {
      setIsLoading(true);
      const supabase = createClient();
      const { data: venue, error } = await supabase
        .from("venues")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      if (venue) {
        onVenueSelect(venue);
        setIsDialogOpen(false);
        form.reset();
      }
    } catch (error) {
      console.error("Error creating venue:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search venues..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchVenues(e.target.value);
            }}
            className="pl-8"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">New Venue</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Venue</DialogTitle>
              <DialogDescription>
                Add a new venue for your event.
              </DialogDescription>
            </DialogHeader>
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
                      <FormLabel>Venue Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter venue name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter postal code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    Create Venue
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {searchQuery && venues.length > 0 && (
        <div className="border rounded-md divide-y">
          {venues.map((venue) => (
            <button
              key={venue.id}
              onClick={() => {
                onVenueSelect(venue);
                setSearchQuery("");
                setVenues([]);
              }}
              className="w-full px-4 py-2 text-left hover:bg-accent transition-colors"
            >
              <div className="font-medium">{venue.name}</div>
              <div className="text-sm text-muted-foreground">
                {venue.address}, {venue.city}, {venue.state} {venue.postal_code}
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedVenue && (
        <div className="flex items-center justify-between border rounded-md p-4">
          <div>
            <div className="font-medium">{selectedVenue.name}</div>
            <div className="text-sm text-muted-foreground">
              {selectedVenue.address}, {selectedVenue.city},{" "}
              {selectedVenue.state} {selectedVenue.postal_code}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onVenueSelect(null)}>
            Change
          </Button>
        </div>
      )}
    </div>
  );
}
