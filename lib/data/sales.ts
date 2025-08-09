import { unstable_noStore as noStore } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { Sale } from "@/lib/supabase/types"

// Normalize a database row into the exact Sale type shape
function normalizeSale(row: any): Sale {
  return {
    id: String(row.id ?? ""),
    product_id: String(row.product_id ?? ""),
    client_id: String(row.client_id ?? ""),
    quantity: Number(row.quantity ?? 0),
    total_amount: Number(row.total_amount ?? row.total ?? row.total_price ?? 0),
    sale_date: String(row.sale_date ?? row.date ?? new Date().toISOString().slice(0, 10)),
    user_id: String(row.user_id ?? row.created_by ?? ""),
    created_at: String(row.created_at ?? new Date().toISOString()),
  }
}

export async function fetchSales(): Promise<Sale[]> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("sales").select("*").order("id", { ascending: false })

  if (error) {
    console.error("Database Error (sales):", error)
    return []
  }

  const rows = (data ?? []) as any[]
  return rows.map(normalizeSale)
}

export async function fetchSaleById(id: string): Promise<Sale | null> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("sales").select("*").eq("id", id).maybeSingle()

  if (error) {
    console.error("Database Error (sale by id):", error)
    return null
  }

  if (!data) return null
  return normalizeSale(data as any)
}
