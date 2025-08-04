import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"

export async function getDashboardData(userId: string) {
  noStore()
  const supabase = createClient()

  const { data: totalProductsData, error: totalProductsError } = await supabase
    .from("products")
    .select("id", { count: "exact" })
    .eq("user_id", userId)

  const { data: totalClientsData, error: totalClientsError } = await supabase
    .from("clients")
    .select("id", { count: "exact" })
    .eq("user_id", userId)

  const { data: totalSuppliersData, error: totalSuppliersError } = await supabase
    .from("suppliers")
    .select("id", { count: "exact" })
    .eq("user_id", userId)

  const { data: totalSalesData, error: totalSalesError } = await supabase
    .from("sales")
    .select("total_amount", { count: "exact" })
    .eq("user_id", userId)

  const { data: totalPurchasesData, error: totalPurchasesError } = await supabase
    .from("purchases")
    .select("total_amount", { count: "exact" })
    .eq("user_id", userId)

  const { data: totalExpensesData, error: totalExpensesError } = await supabase
    .from("expenses")
    .select("amount", { count: "exact" })
    .eq("user_id", userId)

  if (
    totalProductsError ||
    totalClientsError ||
    totalSuppliersError ||
    totalSalesError ||
    totalPurchasesError ||
    totalExpensesError
  ) {
    console.error("Error fetching dashboard data:", {
      totalProductsError,
      totalClientsError,
      totalSuppliersError,
      totalSalesError,
      totalPurchasesError,
      totalExpensesError,
    })
    throw new Error("Failed to fetch dashboard data.")
  }

  const totalProducts = totalProductsData?.length || 0
  const totalClients = totalClientsData?.length || 0
  const totalSuppliers = totalSuppliersData?.length || 0
  const totalSalesAmount = totalSalesData?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0
  const totalPurchasesAmount = totalPurchasesData?.reduce((sum, purchase) => sum + (purchase.total_amount || 0), 0) || 0
  const totalExpensesAmount = totalExpensesData?.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0

  return {
    totalProducts,
    totalClients,
    totalSuppliers,
    totalSalesAmount,
    totalPurchasesAmount,
    totalExpensesAmount,
  }
}
