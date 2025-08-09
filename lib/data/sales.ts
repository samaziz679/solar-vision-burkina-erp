import { getAdminClient } from "@/lib/supabase/admin"

export type Sale = Record<string, unknown>

/**
 * Your errors showed sales.created_at is missing.
 * We avoid ordering by created_at and fall back to id.
 */
export async function fetchSales(): Promise<Sale[]> {
  const supabase = getAdminClient()
  try {
    const { data, error } = await supabase.from("sales").select("*").order("id", { ascending: false })
    if (error) {
      console.error("Database Error (sales):", error)
      return []
    }
    return (data ?? []) as Sale[]
  } catch (e) {
    console.error("Unexpected Error (sales):", e)
    return []
  }
}

export async function fetchSaleById(id: string): Promise<Sale | null> {
  const supabase = getAdminClient()
  try {
    const { data, error } = await supabase.from("sales").select("*").eq("id", id).maybeSingle()
    if (error) {
      console.error("Database Error (sale by id):", error)
      return null
    }
    return (data as Sale) ?? null
  } catch (e) {
    console.error("Unexpected Error (sale by id):", e)
    return null
  }
}
