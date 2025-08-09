import "server-only"

import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  const supabase = getAdminClient()

  async function check(tableOrView: string) {
    try {
      const { data, error } = await supabase.from(tableOrView).select("id").limit(1)
      return { ok: !error, error: error?.message ?? null, sample: data?.[0] ?? null }
    } catch (e: any) {
      return { ok: false, error: e?.message ?? String(e), sample: null }
    }
  }

  const checks = {
    tables: {
      products: await check("products"),
      purchases: await check("purchases"),
      sales: await check("sales"),
      expenses: await check("expenses"),
      banking_accounts: await check("banking_accounts"),
      bank_accounts: await check("bank_accounts"),
      bank_entries: await check("bank_entries"),
    },
    views: {
      financial_summary: await check("financial_summary"),
      total_sales_per_product: await check("total_sales_per_product"),
      current_stock: await check("current_stock"),
    },
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env,
    checks,
  })
}
