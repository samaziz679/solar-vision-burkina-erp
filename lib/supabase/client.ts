import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (typeof window === "undefined") {
      // Prevent build-time error on server/static generation
      console.warn("Supabase env vars are not available at build time on server. Skipping client creation.")
      return null as any
    }
    throw new Error("Missing Supabase environment variables in client.ts")
  }

  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
