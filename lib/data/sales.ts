import { getAdminClient } from "@/lib/supabase/admin"
import type { Sale as DbSale } from "@/lib/supabase/types"

function mapSale(row: Record<string, any>): DbSale {
  const quantity = Number(row.quantity ?? 0)
  const total_amount = Number(row.total_amount ?? row.total ?? row.total_price ?? 0)
  const sale_date = row.sale_date ?? row.date ?? row.created_at ?? new Date().toISOString().split("T")[0]

  return {
    id: String(row.id ?? ""),
    client_id: String(row.client_id ?? row.customer_id ?? ""),
    product_id: String(row.product_id ?? ""),
    quantity,
    total_amount,
    sale_date: String(sale_date),
    user_id: String(row.user_id ?? row.created_by ?? ""),
    created_at: String(row.created_at ?? row.updated_at ?? new Date().toISOString()),
  }
}

export async function fetchSales(): Promise<DbSale[]> {
  const supabase = getAdminClient()
  try {
    const { data, error } = await supabase.from("sales").select("*")
    if (error) {
      console.error("Database Error (sales):", error)
      return []
    }
    const rows = (data ?? []) as Record<string, any>[]
    rows.sort((a, b) => {
      const da = new Date(a.sale_date ?? a.created_at ?? 0).getTime()
      const db = new Date(b.sale_date ?? b.created_at ?? 0).getTime()
      return db - da
    })
    return rows.map(mapSale)
  } catch (err) {
    console.error("Unexpected Error (sales):", err)
    return []
  }
}

export async function fetchSaleById(id: string): Promise<DbSale | null> {
  const supabase = getAdminClient()
  try {
    const { data, error } = await supabase.from("sales").select("*").eq("id", id).maybeSingle()
    if (error) {
      console.error("Database Error (sale by id):", error)
      return null
    }
    if (!data) return null
    return mapSale(data as Record<string, any>)
  } catch (err) {
    console.error("Unexpected Error (sale by id):", err)
    return null
  }
}
