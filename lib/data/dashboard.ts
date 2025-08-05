import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/auth"

export async function getDashboardSummary() {
  const supabase = createClient()
  const user = await getUser()

  // Total Sales
  const { data: salesData, error: salesError } = await supabase
    .from("sales")
    .select("quantity, unit_price")
    .eq("user_id", user.id)

  const totalSales = salesData?.reduce((sum, sale) => sum + sale.quantity * sale.unit_price, 0) || 0

  // Total Purchases
  const { data: purchasesData, error: purchasesError } = await supabase
    .from("purchases")
    .select("quantity, unit_price")
    .eq("user_id", user.id)

  const totalPurchases = purchasesData?.reduce((sum, purchase) => sum + purchase.quantity * purchase.unit_price, 0) || 0

  // Total Expenses
  const { data: expensesData, error: expensesError } = await supabase
    .from("expenses")
    .select("amount")
    .eq("user_id", user.id)

  const totalExpenses = expensesData?.reduce((sum, expense) => sum + expense.amount, 0) || 0

  // Total Banking Accounts Balance (sum of all income - sum of all expenses/transfers for each account)
  const { data: accountsData, error: accountsError } = await supabase
    .from("banking_accounts")
    .select("id")
    .eq("user_id", user.id)

  let totalBankingBalance = 0
  if (accountsData) {
    for (const account of accountsData) {
      const { data: transactionsData, error: transactionsError } = await supabase
        .from("banking_transactions")
        .select("amount, type")
        .eq("account_id", account.id)
        .eq("user_id", user.id)

      if (transactionsData) {
        const accountBalance = transactionsData.reduce((sum, transaction) => {
          if (transaction.type === "income") {
            return sum + transaction.amount
          } else if (transaction.type === "expense" || transaction.type === "transfer") {
            return sum - transaction.amount
          }
          return sum
        }, 0)
        totalBankingBalance += accountBalance
      }
    }
  }

  // Product Stock Count
  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select("stock")
    .eq("user_id", user.id)

  const totalProductsInStock = productsData?.reduce((sum, product) => sum + product.stock, 0) || 0

  if (salesError || purchasesError || expensesError || accountsError || productsError) {
    console.error(
      "Error fetching dashboard summary data:",
      salesError || purchasesError || expensesError || accountsError || productsError,
    )
  }

  return {
    totalSales,
    totalPurchases,
    totalExpenses,
    totalBankingBalance,
    totalProductsInStock,
  }
}

export async function getRecentSales(limit = 5) {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase
    .from("sales")
    .select("*, products(name), clients(name)")
    .eq("user_id", user.id)
    .order("sale_date", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent sales:", error.message)
    return []
  }
  return data || []
}

export async function getRecentPurchases(limit = 5) {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase
    .from("purchases")
    .select("*, products(name), suppliers(name)")
    .eq("user_id", user.id)
    .order("purchase_date", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching recent purchases:", error.message)
    return []
  }
  return data || []
}

export async function getTopSellingProducts(limit = 5) {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase
    .from("sales")
    .select("product_id, quantity, products(name)")
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching top selling products:", error.message)
    return []
  }

  const productSales: { [key: string]: { name: string; totalQuantity: number } } = {}
  data?.forEach((sale) => {
    const productName = (sale.products as { name: string }).name
    if (productSales[sale.product_id]) {
      productSales[sale.product_id].totalQuantity += sale.quantity
    } else {
      productSales[sale.product_id] = { name: productName, totalQuantity: sale.quantity }
    }
  })

  const sortedProducts = Object.values(productSales).sort((a, b) => b.totalQuantity - a.totalQuantity)

  return sortedProducts.slice(0, limit)
}

export async function getExpenseCategoriesSummary() {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase.from("expenses").select("category, amount").eq("user_id", user.id)

  if (error) {
    console.error("Error fetching expense categories summary:", error.message)
    return []
  }

  const categorySummary: { [key: string]: number } = {}
  data?.forEach((expense) => {
    if (categorySummary[expense.category]) {
      categorySummary[expense.category] += expense.amount
    } else {
      categorySummary[expense.category] = expense.amount
    }
  })

  return Object.entries(categorySummary).map(([category, totalAmount]) => ({
    category,
    totalAmount,
  }))
}
