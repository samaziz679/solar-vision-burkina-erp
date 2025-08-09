import { unstable_noStore as noStore } from "next/cache"
import { createClient } from "@/lib/supabase/server"

type SaleRow = { total_amount: number | null }
type ExpenseRow = { amount: number | null }
type ProductRow = { stock_quantity: number | null }

export async function fetchCardData() {
  noStore()
  const supabase = createClient()

  // Total Sales
  const { data: salesData, error: salesError } = await supabase.from("sales").select("total_amount")

  if (salesError) {
    console.error("Database Error (sales):", salesError)
    throw new Error("Failed to fetch sales totals.")
  }

  // Total Expenses
  const { data: expensesData, error: expensesError } = await supabase.from("expenses").select("amount")

  if (expensesError) {
    console.error("Database Error (expenses):", expensesError)
    throw new Error("Failed to fetch expenses totals.")
  }

  // Total Products
  const { data: productsData, error: productsError } = await supabase.from("products").select("stock_quantity")

  if (productsError) {
    console.error("Database Error (products):", productsError)
    throw new Error("Failed to fetch product quantities.")
  }

  const totalSales = (salesData as SaleRow[]).reduce((sum, row) => sum + (row.total_amount ?? 0), 0)
  const totalExpenses = (expensesData as ExpenseRow[]).reduce((sum, row) => sum + (row.amount ?? 0), 0)
  const totalProducts = (productsData as ProductRow[]).reduce((sum, row) => sum + (row.stock_quantity ?? 0), 0)

  return {
    totalSales,
    totalExpenses,
    totalProducts,
  }
}
