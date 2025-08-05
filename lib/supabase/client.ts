// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  if (
    typeof window === 'undefined' ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.warn("Supabase client not initialized — missing env vars or not in browser.")
    return null as any
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
