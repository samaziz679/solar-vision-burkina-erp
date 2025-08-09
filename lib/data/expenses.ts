import { getAdminClient } from "@/lib/supabase/admin"

export type ExpenseRow = Record<string, unknown>

/**
 * Fetch Expenses safely:
 * - Select "*" to avoid missing-column errors (e.g., created_at not present).
 * - Never throw; return [] on error and log details.
 */
export async function fetchExpenses(): Promise<ExpenseRow[]> {
  const supabase = getAdminClient()
  try {
    const { data, error } = await supabase
      .from("expenses" as any)
      .select("*")
      .limit(1000)
    if (error) {
      console.error("Database Error (expenses):", error)
      return []
    }
    return (data ?? []) as ExpenseRow[]
  } catch (err) {
    console.error("Unexpected Error (expenses):", err)
    return []
  }
}
