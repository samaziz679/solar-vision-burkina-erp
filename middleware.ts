import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  try {
    // Create a Supabase client configured to use cookies
    const supabase = createClient(request)

    // Refresh session if expired - this will have a lengthening effect on the session
    // as long as the user continues to be active.
    await supabase.auth.getSession()

    return NextResponse.next()
  } catch (e) {
    // If a redirect happens, `getNext` won't be called, so we need to handle it here.
    // The user is probably not logged in, redirect to login page.
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
     * - login (login page)
     * - auth/callback (Supabase auth callback)
     * - setup-required (setup page)
     * - api (API routes)
     * - public folder (e.g., /public/images)
     */
    "/((?!_next/static|_next/image|favicon.ico|login|auth/callback|setup-required|api|.*\\..*).*)",
  ],
}
