import { getAdminClient } from "@/lib/supabase/admin"
import type { Expense as DbExpense } from "@/lib/supabase/types"

// Map any expense-like row to the app's Expense Row type.
function mapExpense(row: Record<string, any>): DbExpense {
  const amount = Number(row.amount ?? row.total ?? 0)
  const date = row.date ?? row.expense_date ?? row.created_at ?? new Date().toISOString().split("T")[0]
  return {
    id: String(row.id ?? ""),
    amount,
    category: (row.category as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    date: String(date),
    user_id: String(row.user_id ?? row.created_by ?? ""),
    created_at: String(row.created_at ?? row.updated_at ?? new Date().toISOString()),
  }
}

export async function fetchExpenses(): Promise<DbExpense[]> {
  const supabase = getAdminClient()
  try {
    const { data, error } = await supabase.from("expenses").select("*")
    if (error) {
      console.error("Database Error (expenses):", error)
      return []
    }
    const rows = (data ?? []) as Record<string, any>[]
    // Sort safely by date if present; otherwise by id (desc)
    rows.sort((a, b) => {
      const da = new Date(a.date ?? a.created_at ?? 0).getTime()
      const db = new Date(b.date ?? b.created_at ?? 0).getTime()
      return db - da
    })
    return rows.map(mapExpense)
  } catch (err) {
    console.error("Unexpected Error (expenses):", err)
    return []
  }
}

export async function fetchExpenseById(id: string): Promise<DbExpense | null> {
  const supabase = getAdminClient()
  try {
    const { data, error } = await supabase.from("expenses").select("*").eq("id", id).maybeSingle()
    if (error) {
      console.error("Database Error (expense by id):", error)
      return null
    }
    if (!data) return null
    return mapExpense(data as Record<string, any>)
  } catch (err) {
    console.error("Unexpected Error (expense by id):", err)
    return null
  }
}
