import { getAdminClient } from "@/lib/supabase/admin"
import type { Purchase as DbPurchase } from "@/lib/supabase/types"

function mapPurchase(row: Record<string, any>): DbPurchase {
  const quantity = Number(row.quantity ?? 0)
  const unitPrice = Number(row.unit_price ?? row.price ?? 0)
  const total_amount = Number(row.total_amount ?? row.total ?? quantity * unitPrice)
  const purchase_date = row.purchase_date ?? row.date ?? row.created_at ?? new Date().toISOString().split("T")[0]

  return {
    id: String(row.id ?? ""),
    product_id: String(row.product_id ?? ""),
    supplier_id: String(row.supplier_id ?? row.vendor_id ?? ""),
    quantity,
    total_amount,
    purchase_date: String(purchase_date),
    user_id: String(row.user_id ?? row.created_by ?? ""),
    created_at: String(row.created_at ?? row.updated_at ?? new Date().toISOString()),
  }
}

export async function fetchPurchases(): Promise<DbPurchase[]> {
  const supabase = getAdminClient()
  try {
    const { data, error } = await supabase.from("purchases").select("*")
    if (error) {
      console.error("Database Error (purchases):", error)
      return []
    }
    const rows = (data ?? []) as Record<string, any>[]
    rows.sort((a, b) => {
      const da = new Date(a.purchase_date ?? a.created_at ?? 0).getTime()
      const db = new Date(b.purchase_date ?? b.created_at ?? 0).getTime()
      return db - da
    })
    return rows.map(mapPurchase)
  } catch (err) {
    console.error("Unexpected Error (purchases):", err)
    return []
  }
}

export async function fetchPurchaseById(id: string): Promise<DbPurchase | null> {
  const supabase = getAdminClient()
  try {
    const { data, error } = await supabase.from("purchases").select("*").eq("id", id).maybeSingle()
    if (error) {
      console.error("Database Error (purchase by id):", error)
      return null
    }
    if (!data) return null
    return mapPurchase(data as Record<string, any>)
  } catch (err) {
    console.error("Unexpected Error (purchase by id):", err)
    return null
  }
}
