import { NextResponse } from "next/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

export async function GET() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  }

  // Prefer Service Role for a server-only health check
  const useService = Boolean(process.env.SUPABASE_URL) && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  const connectivity: {
    ok: boolean
    source: "service-role" | "server-client"
    details?: unknown
    countProducts?: number | null
  } = {
    ok: false,
    source: useService ? "service-role" : "server-client",
    countProducts: null,
  }

  try {
    if (useService) {
      const admin = createAdminClient(
        process.env.SUPABASE_URL as string,
        process.env.SUPABASE_SERVICE_ROLE_KEY as string,
        { auth: { persistSession: false, autoRefreshToken: false } },
      )

      const { count, error } = await admin.from("products").select("*", { head: true, count: "exact" })

      if (error) throw error
      connectivity.ok = true
      connectivity.countProducts = typeof count === "number" ? count : null
    } else {
      // Fallback to the SSR client
      const client = createServerClient()
      const { data: authData } = await client.auth.getUser()
      const { count, error } = await client.from("products").select("*", { head: true, count: "exact" })

      if (error) throw error
      connectivity.ok = true
      connectivity.countProducts = typeof count === "number" ? count : null
      connectivity.details = { hasSession: Boolean(authData?.user) }
    }
  } catch (e) {
    connectivity.details = {
      error: e instanceof Error ? { name: e.name, message: e.message, stack: e.stack } : String(e),
    }
  }

  return NextResponse.json(
    {
      env,
      connectivity,
      timestamp: new Date().toISOString(),
    },
    { status: connectivity.ok ? 200 : 500 },
  )
}
