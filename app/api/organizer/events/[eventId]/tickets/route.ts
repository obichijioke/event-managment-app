import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as z from "zod";

const ticketSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be non-negative"),
  quantity_available: z.number().int().min(1, "Quantity must be at least 1"),
  sale_start_time: z.string().datetime().optional(),
  sale_end_time: z.string().datetime().optional(),
});

export async function POST(
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

    // Verify the event exists and belongs to the user
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("id", params.eventId)
      .eq("user_id", session.user.id)
      .single();

    if (eventError || !event) {
      return new NextResponse("Event not found or unauthorized", {
        status: 404,
      });
    }

    // Parse and validate the request body
    const json = await request.json();
    const validatedData = ticketSchema.parse(json);

    // Create the ticket
    const { data: ticket, error } = await supabase
      .from("tickets")
      .insert({
        ...validatedData,
        event_id: params.eventId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating ticket:", error);
      return new NextResponse("Failed to create ticket", { status: 500 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }

    console.error(
      "Error in POST /api/organizer/events/[eventId]/tickets:",
      error
    );
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

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

    // Verify the event exists and belongs to the user
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("id", params.eventId)
      .eq("user_id", session.user.id)
      .single();

    if (eventError || !event) {
      return new NextResponse("Event not found or unauthorized", {
        status: 404,
      });
    }

    // Fetch tickets for the event
    const { data: tickets, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("event_id", params.eventId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching tickets:", error);
      return new NextResponse("Failed to fetch tickets", { status: 500 });
    }

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error(
      "Error in GET /api/organizer/events/[eventId]/tickets:",
      error
    );
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
