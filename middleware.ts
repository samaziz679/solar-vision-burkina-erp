import { createClient } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Refresh session if expired - required for Server Components
  // and ensures the user's session is always up-to-date
  await supabase.auth.getSession()

  return response
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
     * - public folder (e.g. /public/placeholder.svg)
     */
    "/((?!_next/static|_next/image|favicon.ico|login|auth/callback|setup-required|.*\\..*).*)",
  ],
}
