import { createClient } from "@/lib/supabase/client";
import { UserFormData } from "@/types";

const supabase = createClient();

export const userService = {
  // Get user profile
  async getUserProfile(userId: string) {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select(
          `
          *,
          events (count),
          orders (count)
        `
        )
        .eq("id", userId)
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, data: Partial<UserFormData>) {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .update({
          name: data.name,
          phone: data.phone,
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  // Get user's events
  async getUserEvents(userId: string) {
    try {
      const { data: events, error } = await supabase
        .from("events")
        .select(
          `
          *,
          venues (id, name, address, city),
          tickets (count)
        `
        )
        .eq("user_id", userId);

      if (error) throw error;
      return events;
    } catch (error) {
      console.error("Error fetching user events:", error);
      throw error;
    }
  },

  // Get user's orders
  async getUserOrders(userId: string) {
    try {
      const { data: orders, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            quantity,
            price_per_item,
            tickets (
              name,
              events (
                name,
                start_time,
                venue_id,
                venues (
                  name,
                  address,
                  city
                )
              )
            )
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return orders;
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
  },

  // Get user's watchlist
  async getUserWatchlist(userId: string) {
    try {
      const { data: watchlist, error } = await supabase
        .from("watchlists")
        .select(
          `
          event_id,
          events (
            name,
            start_time,
            venue_id,
            venues (
              name,
              city
            )
          )
        `
        )
        .eq("user_id", userId);

      if (error) throw error;
      return watchlist;
    } catch (error) {
      console.error("Error fetching user watchlist:", error);
      throw error;
    }
  },

  // Update user role (admin only)
  async updateUserRole(userId: string, role: "user" | "organizer" | "admin") {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  },

  // Get all users (admin only)
  async getUsers(filters?: { role?: string; searchQuery?: string }) {
    try {
      let query = supabase.from("profiles").select(
        `
          *,
          events (count),
          orders (count)
        `
      );

      if (filters?.role) {
        query = query.eq("role", filters.role);
      }

      if (filters?.searchQuery) {
        query = query.or(
          `name.ilike.%${filters.searchQuery}%,email.ilike.%${filters.searchQuery}%`
        );
      }

      const { data: users, error } = await query;

      if (error) throw error;
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Get user analytics
  async getUserAnalytics(userId: string) {
    try {
      const { data, error } = await supabase.rpc("get_user_analytics", {
        user_id: userId,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      throw error;
    }
  },

  // Update user status (active/inactive)
  async updateUserStatus(userId: string, isActive: boolean) {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .update({ is_active: isActive })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  },
};
