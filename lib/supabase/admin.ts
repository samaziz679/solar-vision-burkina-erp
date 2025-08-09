"use server"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Server-only admin client. Never expose the service role key to the client.
let adminClient: SupabaseClient | null = null

export function getAdminClient(): SupabaseClient {
  if (adminClient) return adminClient

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // fallback for local dev only

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin client missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.")
  }

  adminClient = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  return adminClient
}
