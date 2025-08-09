import "server-only"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Server-only Supabase client using the Service Role key.
 * Use only on the server. Bypasses RLS for trusted, read-only queries.
 */
let adminClient: SupabaseClient | null = null

export function getAdminClient(): SupabaseClient {
  if (adminClient) return adminClient
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY on the server")
  }
  adminClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "X-Client-Info": "solar-vision-erp/admin" } },
  })
  return adminClient
}
