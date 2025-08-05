import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  try {
    // Create an authenticated Supabase client
    const { supabase, response } = createClient(request)

    // Refresh session if expired - required for Server Components
    // and Server Actions
    await supabase.auth.getSession()

    return response
  } catch (e) {
    // If an error occurs, redirect to a generic error page or login
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /login (login page)
     * - /auth/callback (Supabase auth callback)
     * - /setup-required (setup required page)
     * - /public (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|login|auth/callback|setup-required|public).*)",
  ],
  runtime: "nodejs", // Explicitly set runtime to Node.js
}
