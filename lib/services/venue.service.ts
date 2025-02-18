import { createClient } from "@/lib/supabase/client";
import { VenueFormData } from "@/types";

const supabase = createClient();

export const venueService = {
  // Create a new venue (organizer only)
  async createVenue(data: VenueFormData) {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user.id) throw new Error("Not authenticated");

      // Check if user is an organizer
      const { data: isOrganizer } = await supabase.rpc("is_organizer", {
        user_id: session.data.session.user.id,
      });

      if (!isOrganizer) throw new Error("Only organizers can create venues");

      const { data: venue, error } = await supabase
        .from("venues")
        .insert([
          {
            name: data.name,
            address: data.address,
            city: data.city,
            state: data.state,
            postal_code: data.postal_code,
            latitude: data.latitude,
            longitude: data.longitude,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return venue;
    } catch (error) {
      console.error("Error creating venue:", error);
      throw error;
    }
  },

  // Get all venues
  async getVenues(filters?: { city?: string; searchQuery?: string }) {
    try {
      let query = supabase.from("venues").select("*");

      if (filters?.city) {
        query = query.eq("city", filters.city);
      }

      if (filters?.searchQuery) {
        query = query.or(
          `name.ilike.%${filters.searchQuery}%,address.ilike.%${filters.searchQuery}%,city.ilike.%${filters.searchQuery}%`
        );
      }

      const { data: venues, error } = await query;

      if (error) throw error;
      return venues;
    } catch (error) {
      console.error("Error fetching venues:", error);
      throw error;
    }
  },

  // Get a single venue by ID
  async getVenueById(venueId: string) {
    try {
      const { data: venue, error } = await supabase
        .from("venues")
        .select("*")
        .eq("id", venueId)
        .single();

      if (error) throw error;
      return venue;
    } catch (error) {
      console.error("Error fetching venue:", error);
      throw error;
    }
  },

  // Update a venue (organizer only)
  async updateVenue(venueId: string, data: Partial<VenueFormData>) {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user.id) throw new Error("Not authenticated");

      // Check if user is an organizer
      const { data: isOrganizer } = await supabase.rpc("is_organizer", {
        user_id: session.data.session.user.id,
      });

      if (!isOrganizer) throw new Error("Only organizers can update venues");

      const { data: venue, error } = await supabase
        .from("venues")
        .update({
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          latitude: data.latitude,
          longitude: data.longitude,
        })
        .eq("id", venueId)
        .select()
        .single();

      if (error) throw error;
      return venue;
    } catch (error) {
      console.error("Error updating venue:", error);
      throw error;
    }
  },

  // Delete a venue (organizer only)
  async deleteVenue(venueId: string) {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user.id) throw new Error("Not authenticated");

      // Check if user is an organizer
      const { data: isOrganizer } = await supabase.rpc("is_organizer", {
        user_id: session.data.session.user.id,
      });

      if (!isOrganizer) throw new Error("Only organizers can delete venues");

      const { error } = await supabase
        .from("venues")
        .delete()
        .eq("id", venueId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting venue:", error);
      throw error;
    }
  },

  // Get venues by city
  async getVenuesByCity(city: string) {
    try {
      const { data: venues, error } = await supabase
        .from("venues")
        .select("*")
        .eq("city", city)
        .order("name");

      if (error) throw error;
      return venues;
    } catch (error) {
      console.error("Error fetching venues by city:", error);
      throw error;
    }
  },

  // Search venues
  async searchVenues(query: string) {
    try {
      const { data: venues, error } = await supabase
        .from("venues")
        .select("*")
        .or(
          `name.ilike.%${query}%,address.ilike.%${query}%,city.ilike.%${query}%`
        )
        .order("name");

      if (error) throw error;
      return venues;
    } catch (error) {
      console.error("Error searching venues:", error);
      throw error;
    }
  },
};
