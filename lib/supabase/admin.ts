import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/types"

// Server-only Supabase admin client (uses Service Role).
// IMPORTANT: Never import this in client components.
let adminClient: SupabaseClient<Database> | null = null

export function getAdminClient(): SupabaseClient<Database> {
  if (adminClient) return adminClient
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  }
  adminClient = createClient<Database>(url, key)
  return adminClient
}
