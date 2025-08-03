import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/lib/supabase/types"

type Product = Tables<"products">
type Sale = Tables<"sales">
type Purchase = Tables<"purchases">
type Expense = Tables<"expenses">
type BankingTransaction = Tables<"banking_transactions">

export async function getDashboardData(userId: string) {
  const supabase = createClient()

  // Fetch total products
  const { count: totalProducts, error: productsError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  if (productsError) {
    console.error("Error fetching total products:", productsError)
  }

  // Fetch total sales amount
  const { data: sales, error: salesError } = await supabase.from("sales").select("amount").eq("user_id", userId)

  const totalSalesAmount = sales?.reduce((sum, sale) => sum + sale.amount, 0) || 0

  if (salesError) {
    console.error("Error fetching total sales amount:", salesError)
  }

  // Fetch total purchases amount
  const { data: purchases, error: purchasesError } = await supabase
    .from("purchases")
    .select("amount")
    .eq("user_id", userId)

  const totalPurchasesAmount = purchases?.reduce((sum, purchase) => sum + purchase.amount, 0) || 0

  if (purchasesError) {
    console.error("Error fetching total purchases amount:", purchasesError)
  }

  // Fetch total expenses amount
  const { data: expenses, error: expensesError } = await supabase
    .from("expenses")
    .select("amount")
    .eq("user_id", userId)

  const totalExpensesAmount = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0

  if (expensesError) {
    console.error("Error fetching total expenses amount:", expensesError)
  }

  // Fetch recent sales (e.g., last 5)
  const { data: recentSales, error: recentSalesError } = await supabase
    .from("sales")
    .select("*, products(name), clients(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  if (recentSalesError) {
    console.error("Error fetching recent sales:", recentSalesError)
  }

  // Fetch low stock products (e.g., stock < 10)
  const { data: lowStockProducts, error: lowStockError } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .lt("stock", 10)
    .order("stock", { ascending: true })
    .limit(5)

  if (lowStockError) {
    console.error("Error fetching low stock products:", lowStockError)
  }

  // Fetch banking balance (simple sum of income - expense transactions)
  const { data: bankingTransactions, error: bankingError } = await supabase
    .from("banking_transactions")
    .select("amount, type")
    .eq("user_id", userId)

  let currentBalance = 0
  if (bankingTransactions) {
    currentBalance = bankingTransactions.reduce((sum, transaction) => {
      return transaction.type === "income" ? sum + transaction.amount : sum - transaction.amount
    }, 0)
  }

  if (bankingError) {
    console.error("Error fetching banking transactions for balance:", bankingError)
  }

  return {
    totalProducts: totalProducts || 0,
    totalSalesAmount,
    totalPurchasesAmount,
    totalExpensesAmount,
    recentSales: recentSales || [],
    lowStockProducts: lowStockProducts || [],
    currentBalance,
  }
}
