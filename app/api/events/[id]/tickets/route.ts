import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const id = (await params).id;
    // Fetch tickets for the event
    const { data: tickets, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("event_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching tickets:", error);
      return new NextResponse("Failed to fetch tickets", { status: 500 });
    }

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Error in GET /api/events/[id]/tickets:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
