import { createClient } from "@/lib/supabase/server"

export async function getDashboardSummary(userId: string) {
  const supabase = createClient()

  // Total Products
  const { count: productCount, error: productError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  if (productError) console.error("Error fetching product count:", productError)

  // Total Sales
  const { data: salesData, error: salesError } = await supabase
    .from("sales")
    .select("total_price")
    .eq("user_id", userId)

  if (salesError) console.error("Error fetching sales data:", salesError)
  const totalSales = salesData?.reduce((sum, sale) => sum + sale.total_price, 0) || 0

  // Total Expenses
  const { data: expensesData, error: expensesError } = await supabase
    .from("expenses")
    .select("amount")
    .eq("user_id", userId)

  if (expensesError) console.error("Error fetching expenses data:", expensesError)
  const totalExpenses = expensesData?.reduce((sum, expense) => sum + expense.amount, 0) || 0

  // Recent Sales (last 5)
  const { data: recentSales, error: recentSalesError } = await supabase
    .from("sales")
    .select("*, products(name), clients(name)")
    .eq("user_id", userId)
    .order("sale_date", { ascending: false })
    .limit(5)

  if (recentSalesError) console.error("Error fetching recent sales:", recentSalesError)

  // Low Stock Products (quantity < 10)
  const { data: lowStockProducts, error: lowStockError } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .lt("quantity_in_stock", 10)
    .order("quantity_in_stock", { ascending: true })
    .limit(5)

  if (lowStockError) console.error("Error fetching low stock products:", lowStockError)

  return {
    totalProducts: productCount || 0,
    totalSales,
    totalExpenses,
    recentSales: recentSales || [],
    lowStockProducts: lowStockProducts || [],
  }
}

export async function getSalesChartData(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("sales")
    .select("sale_date, total_price")
    .eq("user_id", userId)
    .order("sale_date", { ascending: true })

  if (error) {
    console.error("Error fetching sales chart data:", error)
    return []
  }

  const monthlySales: { [key: string]: number } = {}

  data.forEach((sale) => {
    const month = new Date(sale.sale_date).toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    })
    if (!monthlySales[month]) {
      monthlySales[month] = 0
    }
    monthlySales[month] += sale.total_price
  })

  return Object.keys(monthlySales).map((month) => ({
    name: month,
    Sales: monthlySales[month],
  }))
}
