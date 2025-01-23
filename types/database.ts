export type Event = {
  id: string;
  name: string;
  description: string;
  venue_id: string;
  start_time: string;
  end_time: string;
  category: string;
  image_url: string | null;
  is_online: boolean;
  online_url: string | null;
  user_id: string;
  created_at: string;
  status: "draft" | "published" | "cancelled";
  venue?: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
  };
  organizer?: {
    id: string;
    name: string;
    email: string;
  };
  tickets?: {
    id: string;
    price: number;
    name: string;
    description: string;
    quantity_available: number;
    sale_start_time: string;
    sale_end_time: string;
  }[];
};

export type Database = {
  public: {
    tables: {
      events: {
        Row: Event;
        Insert: Omit<
          Event,
          "id" | "created_at" | "organizer" | "venue" | "tickets"
        >;
        Update: Partial<
          Omit<Event, "id" | "created_at" | "organizer" | "venue" | "tickets">
        >;
      };
    };
  };
};
