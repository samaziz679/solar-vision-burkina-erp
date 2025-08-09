import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  try {
    // This `try/catch` block is only for logging errors in development.
    // In a production environment, you might want to use a more robust
    // error logging solution.
    const { supabase, response } = createClient(request)

    // Refresh session if expired - required for Server Components
    // and Server Actions
    await supabase.auth.getSession()

    return response
  } catch (e) {
    // If you are seeing this, you're probably on the Edge Runtime.
    // Good news! This is expected.
    //
    // The Edge Runtime throws and catches errors for `sub` storage access.
    // So, if you're using `revalidatePath` or `cookies().get` in your
    // Server Components you might see this error.
    //
    // An easy way to test this is to add a `console.log` inside `try` block
    // and see if it runs or not.
    console.log("Middleware error:", e)
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
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
