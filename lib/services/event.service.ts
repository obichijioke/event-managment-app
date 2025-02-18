import { createClient } from "@/lib/supabase/client";
import { EventFormData } from "@/types";

const supabase = createClient();

export const eventService = {
  // Create a new event
  async createEvent(data: EventFormData) {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user.id) throw new Error("Not authenticated");

      const { data: event, error } = await supabase
        .from("events")
        .insert([
          {
            name: data.name,
            description: data.description,
            category_id: data.category_id,
            venue_id: data.venue_id,
            cover_image_url: data.cover_image_url,
            gallery_image_urls: data.gallery_image_urls,
            start_time: data.start_time,
            end_time: data.end_time,
            is_online: data.is_online,
            online_url: data.online_url,
            status: "draft",
            user_id: session.data.session.user.id,
          },
        ])
        .select(
          `
          *,
          categories (
            id,
            name,
            slug
          ),
          venues (
            id,
            name,
            address,
            city
          )
        `
        )
        .single();

      if (error) throw error;
      return event;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  // Get all events (with optional filters)
  async getEvents(filters?: {
    userId?: string;
    categoryId?: string;
    status?: string;
    searchQuery?: string;
  }) {
    try {
      let query = supabase.from("events").select(
        `
          *,
          categories (
            id,
            name,
            slug
          ),
          venues (
            id,
            name,
            address,
            city
          ),
          profiles (
            id,
            name,
            email
          )
        `
      );

      if (filters?.userId) {
        query = query.eq("user_id", filters.userId);
      }

      if (filters?.categoryId) {
        query = query.eq("category_id", filters.categoryId);
      }

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.searchQuery) {
        query = query.ilike("name", `%${filters.searchQuery}%`);
      }

      const { data: events, error } = await query;

      if (error) throw error;
      return events;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },

  // Get a single event by ID
  async getEventById(eventId: string) {
    try {
      const { data: event, error } = await supabase
        .from("events")
        .select(
          `
          *,
          categories (
            id,
            name,
            slug
          ),
          venues (
            id,
            name,
            address,
            city
          ),
          profiles (
            id,
            name,
            email
          ),
          tickets (*)
        `
        )
        .eq("id", eventId)
        .single();

      if (error) throw error;
      return event;
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  },

  // Update an event
  async updateEvent(eventId: string, data: Partial<EventFormData>) {
    try {
      const { data: event, error } = await supabase
        .from("events")
        .update({
          name: data.name,
          description: data.description,
          category_id: data.category_id,
          venue_id: data.venue_id,
          cover_image_url: data.cover_image_url,
          gallery_image_urls: data.gallery_image_urls,
          start_time: data.start_time,
          end_time: data.end_time,
          is_online: data.is_online,
          online_url: data.online_url,
        })
        .eq("id", eventId)
        .select(
          `
          *,
          categories (
            id,
            name,
            slug
          ),
          venues (
            id,
            name,
            address,
            city
          )
        `
        )
        .single();

      if (error) throw error;
      return event;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  // Delete an event
  async deleteEvent(eventId: string) {
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },

  // Publish/Unpublish an event
  async toggleEventStatus(
    eventId: string,
    status: "draft" | "published" | "cancelled"
  ) {
    try {
      const { data: event, error } = await supabase
        .from("events")
        .update({ status })
        .eq("id", eventId)
        .select()
        .single();

      if (error) throw error;
      return event;
    } catch (error) {
      console.error("Error toggling event status:", error);
      throw error;
    }
  },

  // Add event to watchlist
  async addToWatchlist(eventId: string) {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("watchlists")
        .insert([{ user_id: session.data.session.user.id, event_id: eventId }]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error adding event to watchlist:", error);
      throw error;
    }
  },

  // Remove event from watchlist
  async removeFromWatchlist(eventId: string) {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("watchlists")
        .delete()
        .match({ user_id: session.data.session.user.id, event_id: eventId });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error removing event from watchlist:", error);
      throw error;
    }
  },
};
