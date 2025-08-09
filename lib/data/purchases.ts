import { getAdminClient } from "@/lib/supabase/admin"

export type Purchase = {
  id?: string
  product_id?: string
  supplier_id?: string
  quantity?: number
  unit_price?: number
  total?: number
  purchase_date?: string
  created_by?: string
  notes?: string
} & Record<string, unknown>

/**
 * Purchases schema (from your image):
 * - total (numeric)
 * - purchase_date (timestamptz)
 * We order by purchase_date if present, else by id.
 */
export async function fetchPurchases(): Promise<Purchase[]> {
  const supabase = getAdminClient()
  try {
    // Try to order by purchase_date; if PostgREST rejects, fall back to id
    let { data, error } = await supabase.from("purchases").select("*").order("purchase_date", { ascending: false })
    if (error) {
      console.warn("Falling back to id order (purchases):", error)
      const r = await supabase.from("purchases").select("*").order("id", { ascending: false })
      data = r.data
      error = r.error
    }
    if (error) {
      console.error("Database Error (purchases):", error)
      return []
    }
    return (data ?? []) as Purchase[]
  } catch (e) {
    console.error("Unexpected Error (purchases):", e)
    return []
  }
}

export async function fetchPurchaseById(id: string): Promise<Purchase | null> {
  const supabase = getAdminClient()
  try {
    const { data, error } = await supabase.from("purchases").select("*").eq("id", id).maybeSingle()
    if (error) {
      console.error("Database Error (purchase by id):", error)
      return null
    }
    return (data as Purchase) ?? null
  } catch (e) {
    console.error("Unexpected Error (purchase by id):", e)
    return null
  }
}
