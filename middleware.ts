import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  try {
    // This `try/catch` block is only here to catch an error that sometimes happens
    // when the Supabase client is initialized in middleware that may not be caught
    // by the `onError` callback in `createClient` and may lead to a `TypeError`.
    // For more information, see https://github.com/supabase/supabase-js/issues/719
    const response = NextResponse.next()
    const supabase = createClient(request, response)
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
