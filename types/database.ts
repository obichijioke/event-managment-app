export type Event = {
  id: string;
  name: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  price: number;
  image_url?: string;
  user_id: string;
  created_at: string;
  status: "draft" | "published" | "cancelled";
  organizer?: {
    id: string;
    name: string;
    email: string;
  };
};

export type Database = {
  public: {
    tables: {
      events: {
        Row: Event;
        Insert: Omit<Event, "id" | "created_at" | "organizer">;
        Update: Partial<Omit<Event, "id" | "created_at" | "organizer">>;
      };
    };
  };
};
