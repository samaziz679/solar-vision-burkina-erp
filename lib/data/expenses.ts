import { getAdminClient } from "@/lib/supabase/admin"

export type Expense = Record<string, unknown>

/**
 * Your schema indicates expenses may not have created_at.
 * We avoid ordering by missing columns and return [] on error.
 */
export async function fetchExpenses(): Promise<Expense[]> {
  const supabase = getAdminClient()
  try {
    const { data, error } = await supabase.from("expenses").select("*").order("id", { ascending: false })
    if (error) {
      console.error("Database Error (expenses):", error)
      return []
    }
    return (data ?? []) as Expense[]
  } catch (e) {
    console.error("Unexpected Error (expenses):", e)
    return []
  }
}

export async function fetchExpenseById(id: string): Promise<Expense | null> {
  const supabase = getAdminClient()
  try {
    const { data, error } = await supabase.from("expenses").select("*").eq("id", id).maybeSingle()
    if (error) {
      console.error("Database Error (expense by id):", error)
      return null
    }
    return (data as Expense) ?? null
  } catch (e) {
    console.error("Unexpected Error (expense by id):", e)
    return null
  }
}
