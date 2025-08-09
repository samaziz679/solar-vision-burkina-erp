import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Server-side Supabase client for App Router (RSC/Route Handlers/Server Actions).
 *
 * Universal cookies adapter:
 * - Exposes BOTH get/set/remove and getAll/setAll to be compatible across @supabase/ssr versions.
 * - set/remove/setAll are NO-OPs during RSC render to avoid header mutations.
 *   Perform cookie mutations in Route Handlers or Server Actions using NextResponse instead.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    throw new Error(
      "Missing Supabase env: ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your Vercel Project Settings.",
    )
  }

  return createServerClient(url, anon, {
    cookies: {
      // Modern adapter shape used by @supabase/ssr in many versions
      get(name: string) {
        try {
          return cookies().get(name)?.value
        } catch {
          return undefined
        }
      },
      set(_name: string, _value: string, _options: CookieOptions) {
        // no-op in RSC render path
      },
      remove(_name: string, _options: CookieOptions) {
        // no-op in RSC render path
      },

      // Legacy/alternative shape some builds expect
      getAll() {
        try {
          return cookies().getAll()
        } catch {
          return []
        }
      },
      setAll(_cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        // no-op in RSC render path
      },
    } as any,
  })
}
