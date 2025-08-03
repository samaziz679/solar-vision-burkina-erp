import { createMiddlewareClient } from "@supabase/ssr"
import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

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
     * - images (image assets)
     * - auth (auth routes)
     * - login (login route)
     * - setup-required (setup route)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|auth|login|setup-required).*)",
  ],
}
