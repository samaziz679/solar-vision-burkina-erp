import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"

export async function getDashboardData(userId: string) {
  noStore()
  const supabase = createClient()

  // Fetch total products
  const { count: totalProducts, error: productsError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  if (productsError) {
    console.error("Error fetching total products:", productsError)
    throw new Error("Failed to fetch total products.")
  }

  // Fetch total sales
  const { data: salesData, error: salesError } = await supabase
    .from("sales")
    .select("quantity, unit_price")
    .eq("user_id", userId)

  if (salesError) {
    console.error("Error fetching total sales:", salesError)
    throw new Error("Failed to fetch total sales.")
  }
  const totalSales = salesData.reduce((sum, sale) => sum + sale.quantity * sale.unit_price, 0)

  // Fetch total purchases
  const { data: purchasesData, error: purchasesError } = await supabase
    .from("purchases")
    .select("quantity, unit_cost")
    .eq("user_id", userId)

  if (purchasesError) {
    console.error("Error fetching total purchases:", purchasesError)
    throw new Error("Failed to fetch total purchases.")
  }
  const totalPurchases = purchasesData.reduce((sum, purchase) => sum + purchase.quantity * purchase.unit_cost, 0)

  // Fetch total expenses
  const { data: expensesData, error: expensesError } = await supabase
    .from("expenses")
    .select("amount")
    .eq("user_id", userId)

  if (expensesError) {
    console.error("Error fetching total expenses:", expensesError)
    throw new Error("Failed to fetch total expenses.")
  }
  const totalExpenses = expensesData.reduce((sum, expense) => sum + expense.amount, 0)

  // Fetch total clients
  const { count: totalClients, error: clientsError } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  if (clientsError) {
    console.error("Error fetching total clients:", clientsError)
    throw new Error("Failed to fetch total clients.")
  }

  // Fetch total suppliers
  const { count: totalSuppliers, error: suppliersError } = await supabase
    .from("suppliers")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  if (suppliersError) {
    console.error("Error fetching total suppliers:", suppliersError)
    throw new Error("Failed to fetch total suppliers.")
  }

  return {
    totalProducts: totalProducts || 0,
    totalSales: totalSales || 0,
    totalPurchases: totalPurchases || 0,
    totalExpenses: totalExpenses || 0,
    totalClients: totalClients || 0,
    totalSuppliers: totalSuppliers || 0,
  }
}
