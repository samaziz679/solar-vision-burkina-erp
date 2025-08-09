import "server-only"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let adminClient: SupabaseClient | null = null

/**
 * Server-only Supabase client using the Service Role key.
 * - Bypasses RLS (trusted). Never expose this on the client.
 * - No cookie handling required.
 */
export function getAdminClient(): SupabaseClient {
  if (!adminClient) {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    }
    adminClient = createClient(url, key, {
      auth: { persistSession: false },
    })
  }
  return adminClient
}
