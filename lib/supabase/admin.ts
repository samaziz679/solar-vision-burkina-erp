import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/types"

// Server-only admin client. Never expose the service role key to the client.
let adminClient: SupabaseClient<Database> | null = null

export function getAdminClient(): SupabaseClient<Database> {
  if (adminClient) return adminClient

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      "Supabase admin client misconfigured: missing SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    )
  }

  adminClient = createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        "X-Client-Info": "solar-vision-erp-admin",
      },
    },
  })

  return adminClient
}
