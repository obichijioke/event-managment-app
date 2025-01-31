export type Category = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: "user" | "organizer" | "admin";
  created_at: string;
  updated_at: string;
};

export type Event = {
  id: string;
  name: string;
  description: string;
  venue_id: string;
  start_time: string;
  end_time: string;
  category_id: string;
  cover_image_url: string | null;
  gallery_image_urls: string[] | null;
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
    phone?: string;
    avatar_url?: string;
  };
  category?: Category;
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
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Category, "id" | "created_at" | "updated_at">>;
      };
      events: {
        Row: Event;
        Insert: Omit<
          Event,
          "id" | "created_at" | "organizer" | "venue" | "tickets" | "category"
        >;
        Update: Partial<
          Omit<
            Event,
            "id" | "created_at" | "organizer" | "venue" | "tickets" | "category"
          >
        >;
      };
    };
  };
};
