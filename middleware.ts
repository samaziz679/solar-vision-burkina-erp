import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    const supabase = createClient(request, response)
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login|auth|setup-required|api|.*\\..*).*)"],
}
