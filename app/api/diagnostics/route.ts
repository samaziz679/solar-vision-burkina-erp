import { NextResponse } from "next/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { createClient as createSSRClient } from "@/lib/supabase/server"

// Lightweight diagnostics to help verify env and DB connectivity in Production.
export async function GET() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    NODE_ENV: process.env.NODE_ENV,
  }

  const report: Record<string, unknown> = { env, checks: {} }

  try {
    if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createAdminClient(
        process.env.SUPABASE_URL as string,
        process.env.SUPABASE_SERVICE_ROLE_KEY as string,
        { auth: { persistSession: false, autoRefreshToken: false } },
      )
      const { count, error } = await admin.from("products").select("*", { head: true, count: "exact" })
      report.checks = { mode: "service-role", productsCount: count ?? null, error: error?.message ?? null }
    } else {
      const ssr = createSSRClient()
      const { data: auth } = await ssr.auth.getUser()
      const { count, error } = await ssr.from("products").select("*", { head: true, count: "exact" })
      report.checks = {
        mode: "ssr",
        hasUser: Boolean(auth?.user),
        productsCount: count ?? null,
        error: error?.message ?? null,
      }
    }
  } catch (e: any) {
    report.error = e?.message ?? String(e)
  }

  const ok = !(report as any).error && !(report.checks as any)?.error
  return NextResponse.json(report, { status: ok ? 200 : 500 })
}
