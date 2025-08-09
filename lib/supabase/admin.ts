import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Server-only admin client using the Service Role key.
// Never import this into Client Components. It bypasses RLS by design.
let adminClient: SupabaseClient | null = null

export function getAdminClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client is not configured. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your Vercel Project Settings.",
    )
  }

  if (!adminClient) {
    adminClient = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        headers: { "x-application-name": "solar-vision-erp" },
      },
    })
  }

  return adminClient
}
