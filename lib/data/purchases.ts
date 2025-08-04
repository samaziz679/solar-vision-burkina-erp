import { createClient } from "@/lib/supabase/server"
import type { Purchase } from "@/lib/supabase/types"

export async function getPurchases(userId: string): Promise<Purchase[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("purchases")
    .select("*, suppliers(name), products(name)")
    .eq("user_id", userId)
    .order("purchase_date", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching purchases:", error)
    return []
  }

  return data.map((purchase) => ({
    ...purchase,
    supplier_name: (purchase.suppliers as { name: string }).name,
    product_name: (purchase.products as { name: string }).name,
  })) as Purchase[]
}

export async function getPurchaseById(purchaseId: string, userId: string): Promise<Purchase | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("purchases")
    .select("*, suppliers(name), products(name)")
    .eq("id", purchaseId)
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching purchase by ID:", error)
    return null
  }

  if (data) {
    return {
      ...data,
      supplier_name: (data.suppliers as { name: string }).name,
      product_name: (data.products as { name: string }).name,
    } as Purchase
  }
  return null
}
