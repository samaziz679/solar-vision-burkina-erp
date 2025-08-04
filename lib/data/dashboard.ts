import { createClient } from "@/lib/supabase/server"

export async function getDashboardData(userId: string) {
  const supabase = createClient()

  // Fetch total income
  const { data: incomeData, error: incomeError } = await supabase
    .from("banking_transactions")
    .select("amount")
    .eq("user_id", userId)
    .eq("type", "income")

  const totalIncome = incomeData?.reduce((sum, t) => sum + t.amount, 0) || 0

  // Fetch total expenses
  const { data: expenseData, error: expenseError } = await supabase
    .from("banking_transactions")
    .select("amount")
    .eq("user_id", userId)
    .eq("type", "expense")

  const totalExpenses = expenseData?.reduce((sum, t) => sum + t.amount, 0) || 0

  // Fetch total sales
  const { data: salesData, error: salesError } = await supabase
    .from("sales")
    .select("quantity, unit_price")
    .eq("user_id", userId)

  const totalSales = salesData?.reduce((sum, s) => sum + s.quantity * s.unit_price, 0) || 0

  // Fetch total purchases
  const { data: purchasesData, error: purchasesError } = await supabase
    .from("purchases")
    .select("quantity, unit_price")
    .eq("user_id", userId)

  const totalPurchases = purchasesData?.reduce((sum, p) => sum + p.quantity * p.unit_price, 0) || 0

  // Fetch product stock levels
  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select("name, stock")
    .eq("user_id", userId)
    .order("stock", { ascending: true })
    .limit(5) // Get top 5 lowest stock products

  // Fetch recent transactions (e.g., last 5 banking transactions)
  const { data: recentTransactions, error: recentTransactionsError } = await supabase
    .from("banking_transactions")
    .select("*, banking_accounts(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  const formattedRecentTransactions = recentTransactions?.map((t) => ({
    ...t,
    account_name: (t.banking_accounts as { name: string }).name,
  }))

  if (incomeError || expenseError || salesError || purchasesError || productsError || recentTransactionsError) {
    console.error("Error fetching dashboard data:", {
      incomeError,
      expenseError,
      salesError,
      purchasesError,
      productsError,
      recentTransactionsError,
    })
    // Return default/empty data in case of error
    return {
      totalIncome: 0,
      totalExpenses: 0,
      totalSales: 0,
      totalPurchases: 0,
      stockLevels: [],
      recentTransactions: [],
    }
  }

  return {
    totalIncome,
    totalExpenses,
    totalSales,
    totalPurchases,
    stockLevels: productsData || [],
    recentTransactions: formattedRecentTransactions || [],
  }
}
