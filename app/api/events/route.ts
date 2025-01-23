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
  category: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || undefined),
  date: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || undefined),
  location: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || undefined),
  sortBy: z.enum(["date", "price", "name"]).optional().default("date"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);

  try {
    const query = querySchema.parse(Object.fromEntries(searchParams));

    const search = query.search;
    const category = query.category;
    const date = query.date;
    const location = query.location;

    let queryToRun = supabase
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

    // Apply search filter
    if (search) {
      queryToRun = queryToRun.or(
        `name.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    // Apply category filter
    if (category) {
      queryToRun = queryToRun.eq("category", category);
    }

    // Apply date filter
    if (date) {
      const [startDate, endDate] = date.split(":");
      if (endDate) {
        // Date range
        queryToRun = queryToRun
          .gte("start_time", `${startDate}T00:00:00Z`)
          .lte("start_time", `${endDate}T23:59:59Z`);
      } else {
        // Single date
        queryToRun = queryToRun
          .gte("start_time", `${date}T00:00:00Z`)
          .lte("start_time", `${date}T23:59:59Z`);
      }
    }

    // Apply location filter
    if (location) {
      queryToRun = queryToRun.eq("venues.city", location);
    }

    // Order by start time
    queryToRun = queryToRun.order("start_time", { ascending: true });

    const { data: events, error } = await queryToRun;

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
