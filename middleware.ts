import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createClient(request)

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // Only log an error if it's not the expected "Auth session missing!" for unauthenticated users
    if (error && error.message !== "Auth session missing!") {
      console.error("Unexpected error getting user in middleware:", error.message)
      // Optionally redirect to an error page or login for unexpected errors
      // return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
    }

    // If user is not logged in and trying to access a protected route, redirect to login
    if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // If user is logged in and trying to access login page, redirect to dashboard
    if (user && request.nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Check if the public.users table has an entry for the current user
    // This is a basic check to ensure the database schema is set up
    if (user) {
      const { data: userData, error: userError } = await supabase.from("users").select("id").eq("id", user.id).single()

      if (userError || !userData) {
        console.warn("User entry not found in public.users table. Redirecting to setup-required.")
        // Redirect to a setup page if the user's entry is missing from public.users
        if (!request.nextUrl.pathname.startsWith("/setup-required")) {
          return NextResponse.redirect(new URL("/setup-required", request.url))
        }
      } else if (request.nextUrl.pathname.startsWith("/setup-required")) {
        // If user data exists and they are on the setup-required page, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    return response
  } catch (e) {
    console.error("Middleware error:", e)
    // In case of any unexpected error, redirect to a generic error page or login
    return NextResponse.redirect(new URL("/login?error=middleware_failed", request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth/callback (Supabase auth callback)
     * - api (API routes)
     * - public folder (e.g., images, fonts)
     */
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|api|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|mp4|webm|ogg|mp3|wav|flac|aac|woff2|woff|eot|ttf|otf)$).*)",
  ],
}
