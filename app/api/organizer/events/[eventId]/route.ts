import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const updateEventSchema = z.object({
  name: z.string().min(1, "Event name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  venue_id: z.string().min(1, "Venue is required").optional(),
  start_time: z.string().min(1, "Start time is required").optional(),
  end_time: z.string().min(1, "End time is required").optional(),
  category_id: z.string().min(1, "Category is required").optional(),
  cover_image_url: z.string().optional(),
  gallery_image_urls: z.array(z.string()).optional(),
  is_online: z.boolean().optional(),
  online_url: z.string().optional(),
  status: z.enum(["draft", "published", "cancelled"]).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: event, error } = await supabase
      .from("events")
      .select(
        `
        *,
        venue:venues (
          id,
          name,
          address,
          city,
          state,
          postal_code
        ),
        category:categories (
          id,
          name,
          description,
          slug
        )
      `
      )
      .eq("id", params.eventId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching event:", error);
      return NextResponse.json(
        { error: "Failed to fetch event" },
        { status: 500 }
      );
    }

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
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
    const validatedData = updateEventSchema.parse(json);

    // Update the event
    const { data: event, error } = await supabase
      .from("events")
      .update(validatedData)
      .eq("id", params.eventId)
      .eq("user_id", user.id)
      .select(
        `
        *,
        venue:venues (
          id,
          name,
          address,
          city,
          state,
          postal_code
        ),
        category:categories (
          id,
          name,
          description,
          slug
        )
      `
      )
      .single();

    if (error) {
      console.error("Error updating event:", error);
      return NextResponse.json(
        { error: "Failed to update event" },
        { status: 500 }
      );
    }

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const eventId = (await params).eventId;
  const supabase = await createClient();
  const { data: error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId);

  if (error) {
    console.error("Error deleting event:", error);
    return new NextResponse("Failed to delete event", { status: 500 });
  }

  return new NextResponse("Event deleted", { status: 200 });
}
