import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  try {
    // This `try/catch` block is only here to catch an error that sometimes happens when Next.js
    // tries to prerender a page with `supabase.auth.getUser()` and the Supabase client cannot be created.
    // This can happen if the environment variables are not set correctly or if the Supabase project is not configured.
    // In a production environment, you should ensure your environment variables are correctly set.
    const { supabase, response } = createClient(request)

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    await supabase.auth.getSession()

    return response
  } catch (e) {
    // If an error occurs, you can return a custom error page or redirect to a login page
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
