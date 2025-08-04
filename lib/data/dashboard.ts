import { createClient } from "@/lib/supabase/server"
import type { BankingTransaction } from "@/lib/supabase/types"

export async function getDashboardData() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      totalSales: 0,
      totalPurchases: 0,
      totalExpenses: 0,
      recentTransactions: [],
      salesByMonth: [],
      purchasesByMonth: [],
    }
  }

  // Fetch total sales
  const { data: salesData, error: salesError } = await supabase
    .from("sales")
    .select("total_amount")
    .eq("user_id", user.id)

  const totalSales = salesData?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0

  // Fetch total purchases
  const { data: purchasesData, error: purchasesError } = await supabase
    .from("purchases")
    .select("total_amount")
    .eq("user_id", user.id)

  const totalPurchases = purchasesData?.reduce((sum, purchase) => sum + purchase.total_amount, 0) || 0

  // Fetch total expenses
  const { data: expensesData, error: expensesError } = await supabase
    .from("expenses")
    .select("amount")
    .eq("user_id", user.id)

  const totalExpenses = expensesData?.reduce((sum, expense) => sum + expense.amount, 0) || 0

  // Fetch recent banking transactions (last 5)
  const { data: recentTransactionsData, error: transactionsError } = await supabase
    .from("banking_transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(5)

  // Fetch sales by month for the last 12 months
  const { data: salesByMonthData, error: salesByMonthError } = await supabase.rpc("get_sales_by_month", {
    user_id_param: user.id,
  })

  // Fetch purchases by month for the last 12 months
  const { data: purchasesByMonthData, error: purchasesByMonthError } = await supabase.rpc("get_purchases_by_month", {
    user_id_param: user.id,
  })

  if (
    salesError ||
    purchasesError ||
    expensesError ||
    transactionsError ||
    salesByMonthError ||
    purchasesByMonthError
  ) {
    console.error(
      "Error fetching dashboard data:",
      salesError || purchasesError || expensesError || transactionsError || salesByMonthError || purchasesByMonthError,
    )
    return {
      totalSales: 0,
      totalPurchases: 0,
      totalExpenses: 0,
      recentTransactions: [],
      salesByMonth: [],
      purchasesByMonth: [],
    }
  }

  return {
    totalSales,
    totalPurchases,
    totalExpenses,
    recentTransactions: recentTransactionsData as BankingTransaction[],
    salesByMonth: salesByMonthData || [],
    purchasesByMonth: purchasesByMonthData || [],
  }
}
