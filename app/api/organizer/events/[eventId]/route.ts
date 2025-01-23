import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as z from "zod";

const eventUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  venue_id: z.string().min(1).optional(),
  start_time: z.coerce.date().optional(),
  end_time: z.coerce.date().optional(),
  category: z.string().min(1).optional(),
  image_url: z.string().optional(),
  is_online: z.boolean().optional(),
  online_url: z.string().optional(),
  status: z.enum(["draft", "published", "cancelled"]).optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const supabase = await createClient();

    // Get the user's session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the event with venue details
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
        )
      `
      )
      .eq("id", params.eventId)
      .eq("user_id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching event:", error);
      return new NextResponse("Failed to fetch event", { status: 500 });
    }

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error in GET /api/organizer/events/[eventId]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const supabase = await createClient();

    // Get the user's session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse and validate the request body
    const json = await request.json();
    const validatedData = eventUpdateSchema.parse(json);
    const eventId = await params.eventId;

    // Update the event
    const { data: event, error } = await supabase
      .from("events")
      .update(validatedData)
      .eq("id", eventId)
      .eq("user_id", session.user.id)
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
        )
      `
      )
      .single();

    if (error) {
      console.error("Error updating event:", error);
      return new NextResponse("Failed to update event", { status: 500 });
    }

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }

    console.error("Error in PATCH /api/organizer/events/[eventId]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
