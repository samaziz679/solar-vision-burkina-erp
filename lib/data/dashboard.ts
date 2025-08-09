import { unstable_noStore as noStore } from "next/cache"
import { createClient } from "@/lib/supabase/server"

type AnyRow = Record<string, unknown>

function firstNumber(row: AnyRow, keys: string[]): number | null {
  for (const k of keys) {
    const v = row?.[k]
    const n = typeof v === "number" ? v : Number(v)
    if (Number.isFinite(n)) return n
  }
  return null
}

export async function fetchCardData() {
  noStore()
  const supabase = createClient()

  // SALES: be flexible about the column name that stores the total.
  let totalSales = 0
  {
    const { data, error } = await supabase.from("sales").select("*")
    if (error) {
      console.error("Database Error (sales):", error)
    } else if (Array.isArray(data)) {
      totalSales = (data as AnyRow[]).reduce((sum, row) => {
        const val = firstNumber(row, ["total_amount", "total", "grand_total", "total_price", "amount"])
        return sum + (val ?? 0)
      }, 0)
    }
  }

  // EXPENSES: common field names.
  let totalExpenses = 0
  {
    const { data, error } = await supabase.from("expenses").select("*")
    if (error) {
      console.error("Database Error (expenses):", error)
    } else if (Array.isArray(data)) {
      totalExpenses = (data as AnyRow[]).reduce((sum, row) => {
        const val = firstNumber(row, ["amount", "total", "value", "expense_amount", "cost"])
        return sum + (val ?? 0)
      }, 0)
    }
  }

  // PRODUCTS: sum stock quantity across products (various field names).
  let totalProducts = 0
  {
    const { data, error } = await supabase.from("products").select("*")
    if (error) {
      console.error("Database Error (products):", error)
    } else if (Array.isArray(data)) {
      totalProducts = (data as AnyRow[]).reduce((sum, row) => {
        const val = firstNumber(row, ["stock_quantity", "quantity", "stock", "in_stock"])
        return sum + (val ?? 0)
      }, 0)
    }
  }

  return {
    totalSales,
    totalExpenses,
    totalProducts,
  }
}
