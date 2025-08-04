import { createClient } from "@/lib/supabase/server"
import type { Sale } from "@/lib/supabase/types"

export async function getSales(userId: string): Promise<Sale[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("sales")
    .select("*, clients(name), products(name)")
    .eq("user_id", userId)
    .order("sale_date", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching sales:", error)
    return []
  }

  return data.map((sale) => ({
    ...sale,
    client_name: (sale.clients as { name: string }).name,
    product_name: (sale.products as { name: string }).name,
  })) as Sale[]
}

export async function getSaleById(saleId: string, userId: string): Promise<Sale | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("sales")
    .select("*, clients(name), products(name)")
    .eq("id", saleId)
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching sale by ID:", error)
    return null
  }

  if (data) {
    return {
      ...data,
      client_name: (data.clients as { name: string }).name,
      product_name: (data.products as { name: string }).name,
    } as Sale
  }
  return null
}
