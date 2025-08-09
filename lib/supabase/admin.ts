import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Server-only Supabase admin client (service role).
 * Do NOT import this into client components.
 */
let adminClient: SupabaseClient | null = null

export function getAdminClient(): SupabaseClient {
  if (adminClient) return adminClient

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase env vars for admin client (SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY).",
    )
  }

  adminClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return adminClient
}

export default getAdminClient
