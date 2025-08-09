import { getAdminClient } from "@/lib/supabase/admin"

export type SaleRow = Record<string, unknown>

/**
 * Fetch Sales safely:
 * - Select "*" to avoid missing-column errors (e.g., created_at not present).
 * - Never throw; return [] on error and log details.
 */
export async function fetchSales(): Promise<SaleRow[]> {
  const supabase = getAdminClient()
  try {
    const { data, error } = await supabase
      .from("sales" as any)
      .select("*")
      .limit(1000)
    if (error) {
      console.error("Database Error (sales):", error)
      return []
    }
    return (data ?? []) as SaleRow[]
  } catch (err) {
    console.error("Unexpected Error (sales):", err)
    return []
  }
}
