import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const id = (await params).id;

    // Fetch event details from Supabase with tickets, organizer, and venue
    const { data: event, error } = await supabase
      .from("events")
      .select(
        `
        *,
        tickets (
          id,
          name,
          description,
          price,
          quantity_available,
          sale_start_time,
          sale_end_time
        ),
        organizer:profiles!user_id (
          id,
          name,
          email
        ),
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
      .eq("id", id)
      .eq("status", "published")
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
