import { createMiddlewareClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        request.cookies.set({ name, value: "", ...options })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is not logged in and trying to access a protected route, redirect to login
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If user is logged in and trying to access login page, redirect to dashboard
  if (user && request.nextUrl.pathname === "/login") {
    const dashboardUrl = new URL("/dashboard", request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)"],
}
