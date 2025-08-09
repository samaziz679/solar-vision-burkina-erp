import { unstable_noStore as noStore } from "next/cache"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

type AnyRow = Record<string, unknown>

function numberFrom(row: AnyRow, keys: string[]): number {
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(row, k)) {
      const v = (row as AnyRow)[k]
      const n = typeof v === "number" ? v : Number(v)
      if (Number.isFinite(n)) return n
    }
  }
  return 0
}

/**
 * Prefer a server-only Service Role client for reliable aggregates (bypasses RLS).
 * Falls back to the regular SSR client if Service Role is not configured.
 */
async function selectAll<T extends AnyRow>(table: string): Promise<T[]> {
  const hasService = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  try {
    if (hasService) {
      const admin = createAdminClient(
        process.env.SUPABASE_URL as string,
        process.env.SUPABASE_SERVICE_ROLE_KEY as string,
        { auth: { persistSession: false, autoRefreshToken: false } },
      )
      const { data, error } = await admin.from(table).select("*")
      if (error) {
        console.warn(`dashboard: service-role select failed for table=${table}`, error) // do not throw
        return []
      }
      return (data ?? []) as T[]
    }

    // Fallback: SSR client (requires RLS allowing read access)
    const client = createServerClient()
    const { data, error } = await client.from(table).select("*")
    if (error) {
      console.warn(`dashboard: ssr select failed for table=${table}`, error) // do not throw
      return []
    }
    return (data ?? []) as T[]
  } catch (e) {
    console.error(`dashboard: unexpected failure selecting from ${table}`, e) // do not throw
    return []
  }
}

/**
 * Fetch totals for dashboard cards.
 * Resilient to schema differences (e.g., total vs total_amount).
 * Never throws — returns 0s on error to keep the page rendering.
 */
export async function fetchCardData(): Promise<{
  totalSales: number
  totalExpenses: number
  totalProducts: number
}> {
  noStore()

  // Detect-and-sum patterns for common column names.
  const salesKeys = ["total_amount", "total", "grand_total", "total_price", "amount"]
  const expenseKeys = ["amount", "total", "value", "expense_amount", "cost"]
  const productQtyKeys = ["stock_quantity", "quantity", "stock", "in_stock", "qty"]

  // Sales
  const salesRows = await selectAll("sales")
  const totalSales = salesRows.reduce((sum, row) => sum + numberFrom(row, salesKeys), 0)

  // Expenses
  const expenseRows = await selectAll("expenses")
  const totalExpenses = expenseRows.reduce((sum, row) => sum + numberFrom(row, expenseKeys), 0)

  // Products (sum quantities)
  const productRows = await selectAll("products")
  const totalProducts = productRows.reduce((sum, row) => sum + numberFrom(row, productQtyKeys), 0)

  return { totalSales, totalExpenses, totalProducts }
}
