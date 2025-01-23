import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    // Get current date in ISO format
    const now = new Date().toISOString();

    // Fetch upcoming events for the user
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select(
        `
        *,
        venue:venues(
          id,
          name,
          address,
          city,
          state,
          postal_code
        )
      `
      )
      .or(
        `user_id.eq.${user.id},id.in.(
        select event_id from orders 
        where user_id = '${user.id}'
      )`
      )
      .gte("start_time", now)
      .order("start_time", { ascending: true })
      .limit(3);

    if (eventsError) {
      console.error("Error fetching events:", eventsError);
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
