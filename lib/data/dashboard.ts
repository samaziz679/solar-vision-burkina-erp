import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"

export async function getDashboardData() {
  noStore()
  const supabase = createClient()

  // Fetch total sales
  const { data: salesData, error: salesError } = await supabase.from("sales").select("total_amount")

  if (salesError) {
    console.error("Error fetching sales data:", salesError)
    return { totalSales: 0, totalExpenses: 0, totalProfit: 0, recentActivities: [] }
  }

  const totalSales = salesData.reduce((sum, sale) => sum + sale.total_amount, 0)

  // Fetch total expenses
  const { data: expensesData, error: expensesError } = await supabase.from("expenses").select("amount")

  if (expensesError) {
    console.error("Error fetching expenses data:", expensesError)
    return { totalSales, totalExpenses: 0, totalProfit: 0, recentActivities: [] }
  }

  const totalExpenses = expensesData.reduce((sum, expense) => sum + expense.amount, 0)

  const totalProfit = totalSales - totalExpenses

  // Fetch recent activities (e.g., last 5 sales or purchases)
  const { data: recentSales, error: recentSalesError } = await supabase
    .from("sales")
    .select("id, client_id, total_amount, sale_date")
    .order("sale_date", { ascending: false })
    .limit(3)

  const { data: recentPurchases, error: recentPurchasesError } = await supabase
    .from("purchases")
    .select("id, supplier_id, total_amount, purchase_date")
    .order("purchase_date", { ascending: false })
    .limit(3)

  if (recentSalesError) {
    console.error("Error fetching recent sales:", recentSalesError)
  }
  if (recentPurchasesError) {
    console.error("Error fetching recent purchases:", recentPurchasesError)
  }

  const recentActivities = [
    ...(recentSales || []).map((s) => ({
      id: s.id,
      type: "Sale",
      amount: s.total_amount,
      date: s.sale_date,
      party: s.client_id, // This would ideally be the client name, requiring a join
    })),
    ...(recentPurchases || []).map((p) => ({
      id: p.id,
      type: "Purchase",
      amount: p.total_amount,
      date: p.purchase_date,
      party: p.supplier_id, // This would ideally be the supplier name, requiring a join
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return {
    totalSales,
    totalExpenses,
    totalProfit,
    recentActivities: recentActivities.slice(0, 5), // Limit to top 5 overall
  }
}
