import { type NextRequest, NextResponse } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs" // Import directly

export async function middleware(request: NextRequest) {
  try {
    // Create a response object
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    // Create a Supabase client with the request and response
    const supabase = createMiddlewareClient({ req: request, res: response })

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    await supabase.auth.getSession()

    return response
  } catch (e) {
    // This catch block is primarily for local development or specific edge cases
    // where the middleware might throw before a response can be created.
    // In production, Supabase auth helpers usually handle errors gracefully.
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
