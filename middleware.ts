import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  try {
    // Refresh session if expired
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("Session state:", {
      hasSession: !!session,
      userId: session?.user?.id,
    });

    // If accessing organizer routes, verify role
    if (request.nextUrl.pathname.startsWith("/organizer")) {
      console.log("Checking organizer access");

      if (!session?.user) {
        console.log("No session or user, redirecting to login");
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      console.log("Profile check:", {
        hasProfile: !!profile,
        role: profile?.role,
        error: profileError?.message,
        userId: session.user.id,
      });

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        return NextResponse.redirect(new URL("/login", request.url));
      }

      if (!profile || profile.role !== "organizer") {
        console.log("Not an organizer, redirecting to home");
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Ensure middleware runs only on pages, not on static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
