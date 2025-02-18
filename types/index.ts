import { Database } from "@/lib/supabase/database.types";

// Event Types
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type EventFormData = Omit<
  Event,
  "id" | "created_at" | "updated_at" | "user_id"
>;

// Ticket Types
export type Ticket = Database["public"]["Tables"]["tickets"]["Row"];
export type TicketFormData = Omit<
  Ticket,
  "id" | "created_at" | "updated_at" | "event_id"
>;

// Venue Types
export type Venue = Database["public"]["Tables"]["venues"]["Row"];
export type VenueFormData = Omit<Venue, "id" | "created_at" | "updated_at">;

// User Types
export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserFormData = Pick<UserProfile, "name" | "phone">;

// Order Types
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

// Reservation Types
export type TicketReservation =
  Database["public"]["Tables"]["ticket_reservations"]["Row"];

// Watchlist Type
export type Watchlist = Database["public"]["Tables"]["watchlists"]["Row"];

// Category Types
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type CategoryFormData = Omit<
  Category,
  "id" | "created_at" | "updated_at"
>;

// Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}
