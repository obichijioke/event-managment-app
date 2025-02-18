import { createClient } from "@/lib/supabase/client";
import { EventFormData } from "@/types";

const supabase = createClient();

export const organizerService = {
  // Get organizer profile
  async getOrganizerProfile() {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user.id) throw new Error("Not authenticated");

      const { data: profile, error } = await supabase
        .from("profiles")
        .select(
          `
          *,
          events (
            id,
            name,
            start_time,
            status,
            venues (
              name,
              city
            ),
            categories (
              name
            )
          )
        `
        )
        .eq("id", session.data.session.user.id)
        .eq("role", "organizer")
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error("Error fetching organizer profile:", error);
      throw error;
    }
  },

  // Get organizer's events
  async getOrganizerEvents(status?: "draft" | "published" | "cancelled") {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user.id) throw new Error("Not authenticated");

      let query = supabase
        .from("events")
        .select(
          `
          *,
          venues (
            id,
            name,
            address,
            city
          ),
          categories (
            id,
            name,
            slug
          ),
          tickets (
            id,
            name,
            price,
            quantity_available
          )
        `
        )
        .eq("user_id", session.data.session.user.id);

      if (status) {
        query = query.eq("status", status);
      }

      const { data: events, error } = await query.order("start_time", {
        ascending: true,
      });

      if (error) throw error;
      return events;
    } catch (error) {
      console.error("Error fetching organizer events:", error);
      throw error;
    }
  },

  // Get event analytics
  async getEventAnalytics(eventId: string) {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user.id) throw new Error("Not authenticated");

      // Verify event ownership
      const { data: event } = await supabase
        .from("events")
        .select("user_id")
        .eq("id", eventId)
        .single();

      if (!event || event.user_id !== session.data.session.user.id) {
        throw new Error("Unauthorized to access event analytics");
      }

      const { data, error } = await supabase.rpc("get_event_analytics", {
        event_id: eventId,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching event analytics:", error);
      throw error;
    }
  },

  // Get organizer's venues
  async getOrganizerVenues() {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user.id) throw new Error("Not authenticated");

      // Check if user is an organizer
      const { data: isOrganizer } = await supabase.rpc("is_organizer", {
        user_id: session.data.session.user.id,
      });

      if (!isOrganizer) throw new Error("Only organizers can access venues");

      const { data: venues, error } = await supabase
        .from("venues")
        .select(
          `
          *,
          events (count)
        `
        )
        .order("name");

      if (error) throw error;
      return venues;
    } catch (error) {
      console.error("Error fetching organizer venues:", error);
      throw error;
    }
  },

  // Create draft event
  async createDraftEvent(data: EventFormData) {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user.id) throw new Error("Not authenticated");

      // Check if user is an organizer
      const { data: isOrganizer } = await supabase.rpc("is_organizer", {
        user_id: session.data.session.user.id,
      });

      if (!isOrganizer) throw new Error("Only organizers can create events");

      const { data: event, error } = await supabase
        .from("events")
        .insert([
          {
            ...data,
            user_id: session.data.session.user.id,
            status: "draft",
          },
        ])
        .select(
          `
          *,
          venues (
            id,
            name,
            address,
            city
          ),
          categories (
            id,
            name,
            slug
          )
        `
        )
        .single();

      if (error) throw error;
      return event;
    } catch (error) {
      console.error("Error creating draft event:", error);
      throw error;
    }
  },

  // Get organizer dashboard stats
  async getDashboardStats() {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user.id) throw new Error("Not authenticated");

      const { data: stats, error } = await supabase
        .from("events")
        .select(
          `
          id,
          status,
          tickets (
            quantity_available,
            price
          )
        `
        )
        .eq("user_id", session.data.session.user.id);

      if (error) throw error;

      // Calculate dashboard stats
      const totalEvents = stats.length;
      const publishedEvents = stats.filter(
        (event) => event.status === "published"
      ).length;
      const totalTickets = stats.reduce((sum, event) => {
        return (
          sum +
          event.tickets.reduce(
            (ticketSum, ticket) => ticketSum + ticket.quantity_available,
            0
          )
        );
      }, 0);
      const potentialRevenue = stats.reduce((sum, event) => {
        return (
          sum +
          event.tickets.reduce(
            (ticketSum, ticket) =>
              ticketSum + ticket.price * ticket.quantity_available,
            0
          )
        );
      }, 0);

      return {
        totalEvents,
        publishedEvents,
        totalTickets,
        potentialRevenue,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },
};
