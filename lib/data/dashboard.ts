import { unstable_noStore as noStore } from "next/cache"
import { createClient as createServiceClient } from "@supabase/supabase-js"

type AnyRow = Record<string, unknown>

type SourceInfo = {
  source: "financial_summary" | "current_stock" | "total_sales_per_product" | "sales" | "expenses" | "products" | "none"
  key?: string
}

type DebugResult = {
  totals: { totalSales: number; totalExpenses: number; totalProducts: number }
  from: { sales: SourceInfo; expenses: SourceInfo; products: SourceInfo }
}

/**
 * Server-only Service Role client for trusted, read-only aggregates.
 * Never import into client components.
 */
function getServiceClient() {
  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createServiceClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function coerceNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v
  const n = typeof v === "string" ? Number(v) : Number.NaN
  return Number.isFinite(n) ? n : null
}

/**
 * Sums the first matching numeric key across rows.
 * Returns sum=0 with no key if none matched to indicate "not found".
 */
function sumFromRows(rows: AnyRow[], candidateKeys: string[]): { sum: number; key?: string } {
  for (const key of candidateKeys) {
    let sum = 0
    let hits = 0
    for (const row of rows) {
      const n = coerceNumber(row?.[key])
      if (n !== null) {
        sum += n
        hits++
      }
    }
    if (hits > 0) return { sum, key }
  }
  return { sum: 0 }
}

/**
 * Try a view first, then fall back to a base table if needed.
 * Never throws — returns both totals and the source/key used for observability.
 */
export async function debugFetchCardData(): Promise<DebugResult> {
  noStore()
  const svc = getServiceClient()

  // Candidate keys by metric
  const SALES_KEYS_VIEW = ["total_sales", "sales_total", "revenue", "total_revenue", "sum_sales"]
  const SALES_KEYS_TABLE = ["total", "grand_total", "total_price", "total_amount", "amount"]

  const EXPENSE_KEYS_VIEW = ["total_expenses", "expenses_total", "expenses", "sum_expenses"]
  const EXPENSE_KEYS_TABLE = ["amount", "total", "value", "expense_amount", "cost"]

  const STOCK_KEYS_VIEW = ["total_stock", "total_quantity", "current_stock", "sum_stock"]
  const STOCK_KEYS_ROW = ["stock_quantity", "quantity", "stock", "in_stock", "qty"]

  let totalSales = 0
  let salesFrom: SourceInfo = { source: "none" }

  let totalExpenses = 0
  let expensesFrom: SourceInfo = { source: "none" }

  let totalProducts = 0
  let productsFrom: SourceInfo = { source: "none" }

  // SALES
  try {
    if (svc) {
      // Prefer SECURITY DEFINER view if present
      const { data: fsData, error: fsErr } = await svc.from("financial_summary").select("*")
      if (!fsErr && Array.isArray(fsData) && fsData.length > 0) {
        const { sum, key } = sumFromRows(fsData as AnyRow[], SALES_KEYS_VIEW)
        if (key) {
          totalSales = sum
          salesFrom = { source: "financial_summary", key }
        }
      }
      if (!salesFrom.key) {
        // Fallback to per-product sales totals view if it exists
        const { data: tpp, error: tppErr } = await svc.from("total_sales_per_product").select("*")
        if (!tppErr && Array.isArray(tpp) && tpp.length > 0) {
          const { sum, key } = sumFromRows(tpp as AnyRow[], [...SALES_KEYS_VIEW, ...SALES_KEYS_TABLE])
          if (key) {
            totalSales = sum
            salesFrom = { source: "total_sales_per_product", key }
          }
        }
      }
      if (!salesFrom.key) {
        // Final fallback: base table with flexible keys
        const { data: sRows, error: sErr } = await svc.from("sales").select("*")
        if (!sErr && Array.isArray(sRows)) {
          const { sum, key } = sumFromRows(sRows as AnyRow[], SALES_KEYS_TABLE)
          totalSales = sum
          salesFrom = { source: "sales", key }
        }
      }
    }
  } catch (e) {
    console.warn("dashboard: sales detection failed", e)
  }

  // EXPENSES
  try {
    if (svc) {
      // Try financial_summary first
      const { data: fsData, error: fsErr } = await svc.from("financial_summary").select("*")
      if (!fsErr && Array.isArray(fsData) && fsData.length > 0) {
        const { sum, key } = sumFromRows(fsData as AnyRow[], EXPENSE_KEYS_VIEW)
        if (key) {
          totalExpenses = sum
          expensesFrom = { source: "financial_summary", key }
        }
      }
      if (!expensesFrom.key) {
        // Fallback to base table
        const { data: eRows, error: eErr } = await svc.from("expenses").select("*")
        if (!eErr && Array.isArray(eRows)) {
          const { sum, key } = sumFromRows(eRows as AnyRow[], EXPENSE_KEYS_TABLE)
          totalExpenses = sum
          expensesFrom = { source: "expenses", key }
        }
      }
    }
  } catch (e) {
    console.warn("dashboard: expenses detection failed", e)
  }

  // PRODUCTS (stock)
  try {
    if (svc) {
      // Prefer SECURITY DEFINER current_stock view
      const { data: csData, error: csErr } = await svc.from("current_stock").select("*")
      if (!csErr && Array.isArray(csData) && csData.length > 0) {
        // Some views return one row with a single total_* column; others return per-product rows
        const oneRow = csData.length === 1
        if (oneRow) {
          const { sum, key } = sumFromRows(csData as AnyRow[], STOCK_KEYS_VIEW)
          if (key) {
            totalProducts = sum
            productsFrom = { source: "current_stock", key }
          }
        }
        if (!productsFrom.key) {
          const { sum, key } = sumFromRows(csData as AnyRow[], STOCK_KEYS_ROW)
          if (key) {
            totalProducts = sum
            productsFrom = { source: "current_stock", key }
          }
        }
      }
      if (!productsFrom.key) {
        // Fallback to products table
        const { data: pRows, error: pErr } = await svc.from("products").select("*")
        if (!pErr && Array.isArray(pRows)) {
          const { sum, key } = sumFromRows(pRows as AnyRow[], STOCK_KEYS_ROW)
          totalProducts = sum
          productsFrom = { source: "products", key }
        }
      }
    }
  } catch (e) {
    console.warn("dashboard: products detection failed", e)
  }

  return {
    totals: {
      totalSales: Number.isFinite(totalSales) ? totalSales : 0,
      totalExpenses: Number.isFinite(totalExpenses) ? totalExpenses : 0,
      totalProducts: Number.isFinite(totalProducts) ? totalProducts : 0,
    },
    from: {
      sales: salesFrom,
      expenses: expensesFrom,
      products: productsFrom,
    },
  }
}

/**
 * Public API for the dashboard page.
 * Returns only numbers and never throws.
 */
export async function fetchCardData() {
  const debug = await debugFetchCardData()
  return debug.totals
}
