import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function getDashboardData(userId: string) {
  const cookieStore = cookies()
  const supabase = createServerClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.delete({ name, ...options })
      },
    },
  })

  let totalSales = 0
  let totalExpenses = 0
  let totalProducts = 0
  let totalClients = 0
  let error: Error | null = null

  // Fetch total sales
  const { data: salesData, error: salesError } = await supabase
    .from("sales")
    .select("quantity, unit_price")
    .eq("user_id", userId)
  if (salesError) {
    console.error("Error fetching sales data:", salesError)
    error = salesError
  } else {
    totalSales = salesData.reduce((sum, sale) => sum + sale.quantity * sale.unit_price, 0)
  }

  // Fetch total expenses
  const { data: expensesData, error: expensesError } = await supabase
    .from("expenses")
    .select("amount")
    .eq("user_id", userId)
  if (expensesError) {
    console.error("Error fetching expenses data:", expensesError)
    error = expensesError
  } else {
    totalExpenses = expensesData.reduce((sum, expense) => sum + expense.amount, 0)
  }

  // Fetch total unique products
  const { count: productsCount, error: productsError } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
  if (productsError) {
    console.error("Error fetching products count:", productsError)
    error = productsError
  } else {
    totalProducts = productsCount || 0
  }

  // Fetch total unique clients
  const { count: clientsCount, error: clientsError } = await supabase
    .from("clients")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
  if (clientsError) {
    console.error("Error fetching clients count:", clientsError)
    error = clientsError
  } else {
    totalClients = clientsCount || 0
  }

  return { totalSales, totalExpenses, totalProducts, totalClients, error }
}
