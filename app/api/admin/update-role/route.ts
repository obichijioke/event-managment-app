import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user is an admin or if there are no admins yet
    const { data: adminCheck } = await supabase
      .from("profiles")
      .select("role")
      .eq("role", "admin");

    const isFirstUser = !adminCheck || adminCheck.length === 0;

    if (!isFirstUser) {
      // If not the first user, check if the current user is an admin
      const { data: currentUserProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (currentUserProfile?.role !== "admin") {
        return NextResponse.json(
          { error: "Only admins can update roles" },
          { status: 403 }
        );
      }
    }

    // Get the target user and new role from the request
    const { targetUserId, role } = await request.json();

    if (
      !targetUserId ||
      !role ||
      !["user", "organizer", "admin"].includes(role)
    ) {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    // Update the user's role
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", targetUserId);

    if (updateError) {
      console.error("Error updating role:", updateError);
      return NextResponse.json(
        { error: "Failed to update role" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
