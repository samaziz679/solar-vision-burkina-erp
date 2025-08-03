import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  try {
    // This `try/catch` block is only here to avoid Next.js errors
    // when deploying this example to vercel with `externalFlags: { enableUndici: true }`
    // https://github.com/vercel/next.js/pull/53688
    const { supabase, response } = createClient(request)

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    await supabase.auth.getSession()

    return response
  } catch (e) {
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
