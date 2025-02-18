export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          user_id: string;
          venue_id: string | null;
          name: string;
          description: string;
          cover_image_url: string | null;
          gallery_image_urls: string[] | null;
          category_id: string;
          start_time: string;
          end_time: string;
          is_online: boolean;
          online_url: string | null;
          status: "draft" | "published" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["events"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
      };
      tickets: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          description: string | null;
          price: number;
          quantity_available: number;
          sale_start_time: string | null;
          sale_end_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["tickets"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["tickets"]["Insert"]>;
      };
      venues: {
        Row: {
          id: string;
          name: string;
          address: string;
          city: string;
          state: string;
          postal_code: string;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["venues"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["venues"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          name: string | null;
          email: string;
          phone: string | null;
          role: "user" | "organizer" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_date: string;
          total_amount: number;
          payment_status: "pending" | "paid" | "failed" | "refunded";
          payment_method: string | null;
          transaction_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["orders"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          ticket_id: string;
          quantity: number;
          price_per_item: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["order_items"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      ticket_reservations: {
        Row: {
          id: string;
          user_id: string | null;
          ticket_id: string;
          quantity: number;
          reservation_time: string;
          expires_at: string;
          status: "pending" | "confirmed" | "expired" | "cancelled";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["ticket_reservations"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["ticket_reservations"]["Insert"]
        >;
      };
      watchlists: {
        Row: {
          user_id: string;
          event_id: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["watchlists"]["Row"],
          "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["watchlists"]["Insert"]>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["categories"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: { user_id: string };
        Returns: boolean;
      };
      is_organizer: {
        Args: { user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: "user" | "organizer" | "admin";
      event_status: "draft" | "published" | "cancelled";
      payment_status: "pending" | "paid" | "failed" | "refunded";
      reservation_status: "pending" | "confirmed" | "expired" | "cancelled";
    };
  };
}
