import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"

export async function getDashboardData(userId: string) {
  noStore()
  const supabase = createClient()

  // Fetch total sales
  const { data: salesData, error: salesError } = await supabase
    .from("sales")
    .select("quantity, unit_price")
    .eq("user_id", userId)

  if (salesError) {
    console.error("Error fetching sales data:", salesError)
    throw new Error("Failed to fetch sales data.")
  }

  const totalSales = salesData.reduce((sum, sale) => sum + sale.quantity * sale.unit_price, 0)

  // Fetch total expenses
  const { data: expensesData, error: expensesError } = await supabase
    .from("expenses")
    .select("amount")
    .eq("user_id", userId)

  if (expensesError) {
    console.error("Error fetching expenses data:", expensesError)
    throw new Error("Failed to fetch expenses data.")
  }

  const totalExpenses = expensesData.reduce((sum, expense) => sum + expense.amount, 0)

  // Fetch total products in stock
  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select("stock")
    .eq("user_id", userId)

  if (productsError) {
    console.error("Error fetching products data:", productsError)
    throw new Error("Failed to fetch products data.")
  }

  const totalProductsInStock = productsData.reduce((sum, product) => sum + product.stock, 0)

  // Fetch recent sales (e.g., last 5)
  const { data: recentSales, error: recentSalesError } = await supabase
    .from("sales")
    .select("*, products(name), clients(name)")
    .eq("user_id", userId)
    .order("sale_date", { ascending: false })
    .limit(5)

  if (recentSalesError) {
    console.error("Error fetching recent sales:", recentSalesError)
    throw new Error("Failed to fetch recent sales.")
  }

  // Fetch recent purchases (e.g., last 5)
  const { data: recentPurchases, error: recentPurchasesError } = await supabase
    .from("purchases")
    .select("*, products(name), suppliers(name)")
    .eq("user_id", userId)
    .order("purchase_date", { ascending: false })
    .limit(5)

  if (recentPurchasesError) {
    console.error("Error fetching recent purchases:", recentPurchasesError)
    throw new Error("Failed to fetch recent purchases.")
  }

  return {
    totalSales,
    totalExpenses,
    totalProductsInStock,
    recentSales,
    recentPurchases,
  }
}
