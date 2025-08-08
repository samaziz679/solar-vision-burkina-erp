'use client'

import { createBrowserClient, type SupabaseClient } from '@supabase/ssr'

let browserClient: SupabaseClient | null = null

export function getBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return browserClient
}
