import "server-only"

import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import type { SupabaseClient } from "@supabase/supabase-js"

export async function GET() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  // Use admin client for diagnostics (no cookies required)
  const admin = getAdminClient()

  // Cast to an "any" Database so we can probe arbitrary tables/views
  const anyAdmin = admin as unknown as SupabaseClient<any>

  async function check(tableOrView: string) {
    try {
      const { data, error } = await anyAdmin.from(tableOrView).select("id").limit(1)
      return { ok: !error, error: error?.message ?? null, sample: data?.[0] ?? null }
    } catch (e: any) {
      return { ok: false, error: e?.message ?? String(e), sample: null }
    }
  }

  // Optional: validate that the RSC client can run a basic query with current cookies adapter
  let rscClientCheck: { ok: boolean; error: string | null } = { ok: true, error: null }
  try {
    const supabase = createClient()
    const { error } = await supabase.from("products").select("id").limit(1)
    if (error) rscClientCheck = { ok: false, error: error.message }
  } catch (e: any) {
    rscClientCheck = { ok: false, error: e?.message ?? String(e) }
  }

  const checks = {
    tables: {
      products: await check("products"),
      purchases: await check("purchases"),
      sales: await check("sales"),
      expenses: await check("expenses"),
      // These may not exist in your typed schema; diagnostics intentionally probes them anyway.
      banking_accounts: await check("banking_accounts"),
      bank_accounts: await check("bank_accounts"),
      bank_entries: await check("bank_entries"),
    },
    views: {
      financial_summary: await check("financial_summary"),
      total_sales_per_product: await check("total_sales_per_product"),
      current_stock: await check("current_stock"),
    },
    rscClientCheck,
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env,
    checks,
  })
}
