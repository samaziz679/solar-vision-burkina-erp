// Supabase server client for App Router (SSR/RSC-safe)
// Provides a universal cookies adapter compatible with different @supabase/ssr expectations.

import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
  // Acquire the request-scoped cookie store inside the function (never at module top level)
  let cookieStore: ReturnType<typeof cookies> | undefined
  try {
    cookieStore = cookies()
  } catch {
    // When there's no request context (e.g., during static build), leave undefined
    cookieStore = undefined
  }

  // Defensive adapter: expose both get/set/remove and getAll/setAll
  const adapter: any = {
    // Primary shape used by newer @supabase/ssr
    get(name: string) {
      try {
        return cookieStore?.get(name)?.value
      } catch {
        return undefined
      }
    },
    set(_name: string, _value: string, _options: CookieOptions) {
      // No-op in RSC/SSR render path; mutations should happen in Route Handlers or Server Actions
    },
    remove(_name: string, _options: CookieOptions) {
      // No-op
    },
    // Back-compat shape some versions expect
    getAll() {
      try {
        const all = (cookieStore as any)?.getAll?.() ?? []
        // Normalize to { name, value }
        return all.map((c: any) => ({ name: c.name, value: c.value }))
      } catch {
        return []
      }
    },
    setAll(_cookies: { name: string; value: string; options?: CookieOptions }[]) {
      // No-op
    },
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  return createServerClient(url, anon, { cookies: adapter })
}
