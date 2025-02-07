import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().min(1, "Description is required"),
  venue_id: z.string().min(1, "Venue is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  category_id: z.string().min(1, "Category is required"),
  cover_image_url: z.string().optional(),
  gallery_image_urls: z.array(z.string()).optional(),
  is_online: z.boolean().default(false),
  online_url: z.string().optional(),
});

export async function GET() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: events, error } = await supabase
      .from("events")
      .select(
        `
        *,
        organizer:profiles!user_id (
          id,
          email,
          name
        ),
        tickets (
          id,
          price,
          quantity_available
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching events:", error);
      return NextResponse.json(
        { error: "Failed to fetch events" },
        { status: 500 }
      );
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();

    // Validate the request body
    const validatedData = eventSchema.parse(json);

    // Prepare event data
    const eventData = {
      ...validatedData,
      user_id: user.id,
      organizer_id: user.id,
      status: "draft",
    };

    console.log(eventData);

    // Insert the event
    const { data: event, error } = await supabase
      .from("events")
      .insert([eventData])
      .select()
      .single();

    if (error) {
      console.error("Error creating event:", error);
      return NextResponse.json(
        { error: "Failed to create event" },
        { status: 500 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
