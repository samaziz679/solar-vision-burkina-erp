import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/types"

const cookieStore = cookies()
const supabase = createServerClient<Database>({
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

export async function fetchTotalSales() {
  const { data, error } = await supabase.from("sales").select("total_amount")

  if (error) {
    console.error("Error fetching total sales:", error)
    return 0
  }

  return data.reduce((sum, sale) => sum + sale.total_amount, 0)
}

export async function fetchTotalPurchases() {
  const { data, error } = await supabase.from("purchases").select("total_amount")

  if (error) {
    console.error("Error fetching total purchases:", error)
    return 0
  }

  return data.reduce((sum, purchase) => sum + purchase.total_amount, 0)
}

export async function fetchTotalExpenses() {
  const { data, error } = await supabase.from("expenses").select("amount")

  if (error) {
    console.error("Error fetching total expenses:", error)
    return 0
  }

  return data.reduce((sum, expense) => sum + expense.amount, 0)
}

export async function fetchTotalClients() {
  const { count, error } = await supabase.from("clients").select("*", { count: "exact" })

  if (error) {
    console.error("Error fetching total clients:", error)
    return 0
  }

  return count || 0
}

export async function fetchRecentSales() {
  const { data, error } = await supabase
    .from("sales")
    .select("*, products(name), clients(name)")
    .order("sale_date", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching recent sales:", error)
    return []
  }

  return data.map((sale) => ({
    ...sale,
    product_name: sale.products?.name || "N/A",
    client_name: sale.clients?.name || "N/A",
  }))
}

export async function fetchRecentPurchases() {
  const { data, error } = await supabase
    .from("purchases")
    .select("*, products(name), suppliers(name)")
    .order("purchase_date", { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching recent purchases:", error)
    return []
  }

  return data.map((purchase) => ({
    ...purchase,
    product_name: purchase.products?.name || "N/A",
    supplier_name: purchase.suppliers?.name || "N/A",
  }))
}

export async function fetchLowStockProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .lt("stock", 10) // Products with less than 10 units in stock
    .order("stock", { ascending: true })
    .limit(5)

  if (error) {
    console.error("Error fetching low stock products:", error)
    return []
  }

  return data
}
