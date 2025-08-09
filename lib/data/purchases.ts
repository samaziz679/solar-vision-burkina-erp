import { getAdminClient } from "@/lib/supabase/admin"

export type PurchaseRow = Record<string, unknown>

/**
 * Fetch Purchases safely:
 * - Select "*" to avoid missing-column errors (e.g., created_at not present).
 * - Never throw; return [] on error and log details.
 */
export async function fetchPurchases(): Promise<PurchaseRow[]> {
  const supabase = getAdminClient()
  try {
    const { data, error } = await supabase
      .from("purchases" as any)
      .select("*")
      .limit(1000)
    if (error) {
      console.error("Database Error (purchases):", error)
      return []
    }
    return (data ?? []) as PurchaseRow[]
  } catch (err) {
    console.error("Unexpected Error (purchases):", err)
    return []
  }
}
