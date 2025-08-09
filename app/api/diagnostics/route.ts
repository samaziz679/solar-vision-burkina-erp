import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const supabase = getAdminClient()

  const env = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  async function probe(label: string, table: string) {
    try {
      const { data, error } = await supabase.from(table).select("id").limit(1)
      if (error) return { label, ok: false, error: { code: error.code, message: error.message } }
      return { label, ok: true, rows: data?.length ?? 0 }
    } catch (e: any) {
      return { label, ok: false, error: { message: String(e?.message ?? e) } }
    }
  }

  const checks = await Promise.all([
    probe("products", "products"),
    probe("purchases", "purchases"),
    probe("sales", "sales"),
    probe("expenses", "expenses"),
    // Try the common banking table names to see what exists
    probe("banking_accounts", "banking_accounts"),
    probe("bank_accounts", "bank_accounts"),
    probe("bank_entries", "bank_entries"),
    // Reporting views if present
    probe("view:financial_summary", "financial_summary"),
    probe("view:total_sales_per_product", "total_sales_per_product"),
    probe("view:current_stock", "current_stock"),
  ])

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env,
    checks,
  })
}
