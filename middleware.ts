import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/middleware" // This import now points to the new file

export async function middleware(request: NextRequest) {
  try {
    // Create a response object
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    // Create a Supabase client using the helper from the new file
    const supabase = createClient(request, response)

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    await supabase.auth.getSession()

    return response
  } catch (e) {
    console.error("Middleware error:", e)
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
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
     * - auth (auth callback)
     * - setup-required (setup page)
     * - api (api routes)
     * - public (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|login|auth|setup-required|api|.*\\..*).*)",
  ],
}
