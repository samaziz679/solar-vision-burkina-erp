import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Server-side Supabase client for App Router (RSC/Route Handlers/Actions).
 *
 * Universal cookies adapter:
 * - Exposes both get/set/remove and getAll/setAll to be compatible across @supabase/ssr versions.
 * - set/remove/setAll are NO-OPs in RSC to avoid mutating headers during render.
 *   Perform cookie mutations in Route Handlers or Server Actions with NextResponse.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    throw new Error(
      "Missing Supabase env: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel Project Settings.",
    )
  }

  return createServerClient(url, anon, {
    cookies: {
      // Newer API shape on some @supabase/ssr paths
      get(name: string) {
        try {
          return cookies().get(name)?.value
        } catch {
          return undefined
        }
      },
      set(_name: string, _value: string, _options: CookieOptions) {
        // no-op in RSC
      },
      remove(_name: string, _options: CookieOptions) {
        // no-op in RSC
      },

      // Older / alternative API shape used in some environments
      getAll() {
        try {
          return cookies().getAll()
        } catch {
          return []
        }
      },
      setAll(_cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        // no-op in RSC
      },
    } as any,
  })
}
