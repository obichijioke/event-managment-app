import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import * as z from "zod";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || undefined),
  sortBy: z.enum(["date", "price", "name"]).optional().default("date"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);

    // Validate and parse query parameters
    const { page, limit, search, sortBy, sortOrder } =
      querySchema.parse(searchParams);

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
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
        tickets (
          id,
          price
        )
      `,
        { count: "exact" }
      )
      .eq("status", "published");

    // Add search condition if provided
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    // Add sorting
    switch (sortBy) {
      case "date":
        query = query.order("start_time", { ascending: sortOrder === "asc" });
        break;
      case "name":
        query = query.order("name", { ascending: sortOrder === "asc" });
        break;
      // Remove price sorting since it's now based on tickets
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data: events, error, count } = await query;

    if (error) {
      console.error("Error fetching events:", error);
      return new NextResponse("Failed to fetch events", { status: 500 });
    }

    // Calculate pagination metadata
    const totalPages = count ? Math.ceil(count / limit) : 0;
    const hasMore = page < totalPages;

    return NextResponse.json({
      events,
      metadata: {
        currentPage: page,
        totalPages,
        totalCount: count,
        hasMore,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }

    console.error("Error in GET /api/events:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
