import { unstable_noStore as noStore } from "next/cache"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"

type AnyRow = Record<string, unknown>

function pickFirstNumber(row: AnyRow, keys: string[]): number {
  for (const k of keys) {
    if (k in row) {
      const v = row[k]
      const n = typeof v === "number" ? v : Number(v)
      if (Number.isFinite(n)) return n
    }
  }
  return 0
}

async function selectAll<T extends AnyRow>(table: string): Promise<{ rows: T[]; ok: boolean }> {
  // Prefer Service Role for server-side aggregates (bypass RLS safely on server).
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
        // eslint-disable-next-line no-console
        console.warn(`dashboard: ${table} query failed (service-role)`, error)
        return { rows: [], ok: false }
      }
      return { rows: (data ?? []) as T[], ok: true }
    }

    // Fallback to SSR client (requires RLS policies to allow read)
    const supabase = createServerClient()
    const { data, error } = await supabase.from(table).select("*")
    if (error) {
      // eslint-disable-next-line no-console
      console.warn(`dashboard: ${table} query failed (server-client)`, error)
      return { rows: [], ok: false }
    }
    return { rows: (data ?? []) as T[], ok: true }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`dashboard: unexpected failure selecting from ${table}`, e)
    return { rows: [], ok: false }
  }
}

/**
 * Fetch totals for dashboard cards. This function is resilient:
 * - flexible column detection
 * - never throws; returns 0s on error
 */
export async function fetchCardData(): Promise<{
  totalSales: number
  totalExpenses: number
  totalProducts: number
}> {
  noStore()

  // Sales
  const salesCols = ["total_amount", "total", "grand_total", "total_price", "amount"]
  let totalSales = 0
  {
    const { rows } = await selectAll("sales")
    totalSales = rows.reduce((sum, row) => sum + pickFirstNumber(row, salesCols), 0)
  }

  // Expenses
  const expenseCols = ["amount", "total", "value", "expense_amount", "cost"]
  let totalExpenses = 0
  {
    const { rows } = await selectAll("expenses")
    totalExpenses = rows.reduce((sum, row) => sum + pickFirstNumber(row, expenseCols), 0)
  }

  // Products (sum stock quantities)
  const productQtyCols = ["stock_quantity", "quantity", "stock", "in_stock", "qty"]
  let totalProducts = 0
  {
    const { rows } = await selectAll("products")
    totalProducts = rows.reduce((sum, row) => sum + pickFirstNumber(row, productQtyCols), 0)
  }

  return {
    totalSales,
    totalExpenses,
    totalProducts,
  }
}
