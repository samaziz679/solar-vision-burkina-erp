import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { fetchCardData } from "@/lib/data/dashboard"

export async function GET() {
  const env = {
    SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  }

  const sources: Record<string, { ok: boolean; err?: unknown }> = {}
  try {
    const supabase = getAdminClient()
    const tables = [
      "products",
      "purchases",
      "sales",
      "expenses",
      "banking_accounts",
      "bank_accounts",
      "bank_entries",
      "financial_summary",
      "total_sales_per_product",
      "current_stock",
    ]
    await Promise.all(
      tables.map(async (t) => {
        const { error } = await supabase.from(t).select("*").limit(1)
        sources[t] = { ok: !error, err: error ?? undefined }
      }),
    )
  } catch (e) {
    sources["adminClient"] = { ok: false, err: String(e) }
  }

  let cards: { totalSales: number; totalExpenses: number; totalProducts: number } = {
    totalSales: 0,
    totalExpenses: 0,
    totalProducts: 0,
  }
  try {
    cards = await fetchCardData()
  } catch (e) {
    // keep defaults
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env,
    tables: sources,
    cards,
  })
}
