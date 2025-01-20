import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { z } from "zod";

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
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const validatedQuery = querySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      sortBy: searchParams.get("sortBy"),
      sortOrder: searchParams.get("sortOrder"),
    });

    const { page, limit, search, sortBy, sortOrder } = validatedQuery;
    const offset = (page - 1) * limit;

    // Create base query
    let query = supabase
      .from("events")
      .select("*", { count: "exact" })
      .eq("status", "published");

    // Apply sorting
    switch (sortBy) {
      case "date":
        query = query.order("start_time", { ascending: sortOrder === "asc" });
        break;
      case "price":
        query = query.order("price", { ascending: sortOrder === "asc" });
        break;
      case "name":
        query = query.order("name", { ascending: sortOrder === "asc" });
        break;
    }

    query = query.range(offset, offset + limit - 1);

    // Add search functionality if search parameter is provided
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`
      );
    }

    // Execute query
    const { data: events, error, count } = await query;

    if (error) {
      console.error("Error fetching events:", error);
      return NextResponse.json(
        { error: "Failed to fetch events" },
        { status: 500 }
      );
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
    console.error("Error processing request:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
