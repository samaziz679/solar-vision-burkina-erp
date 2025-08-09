import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Server-side Supabase client for App Router (RSC/Route Handlers).
 *
 * Why this shape?
 * - @supabase/ssr expects a cookies adapter with get/set/remove in many versions.
 * - In React Server Components you cannot mutate cookies during render, so set/remove are no-ops here.
 * - Do cookie mutations in Route Handlers or Server Actions with NextResponse instead.
 */
export function createClient() {
  const cookieStore = cookies()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    throw new Error(
      "Missing Supabase env: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel Project Settings.",
    )
  }

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        // Read cookie value safely in RSC
        try {
          return cookieStore.get(name)?.value
        } catch {
          return undefined
        }
      },
      // No-ops in RSC render path
      set(_name: string, _value: string, _options: CookieOptions) {},
      remove(_name: string, _options: CookieOptions) {},
    } as any,
  })
}
