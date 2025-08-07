import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr' // Import createServerClient

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Step 1: Update the session and get the response with updated cookies.
  // This call ensures the session is refreshed and cookies are set on the response.
  const response = await updateSession(request)

  // Step 2: Create a new Supabase client within the middleware.
  // This client will use the cookies from the request, which should now be updated
  // by the previous call to updateSession.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // These set/remove operations are primarily for internal Supabase client use
          // within the middleware. They ensure consistency between request and response cookies.
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Step 3: Get the user from the newly created Supabase client.
  const { data: { user } } = await supabase.auth.getUser()

  // Allow access to /login and /auth/callback without authentication
  if (pathname.startsWith('/login') || pathname.startsWith('/auth/callback') || pathname === '/') {
    return response // Return the response with updated session
  }

  // For all other routes, check authentication
  if (!user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set(`redirectedFrom`, request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any files in the public folder (e.g. /vercel.svg)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
