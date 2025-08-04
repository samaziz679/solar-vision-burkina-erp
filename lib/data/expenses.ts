import { createClient } from "@/lib/supabase/server"
import type { Expense } from "@/lib/supabase/types"

export async function getExpenses(userId: string): Promise<Expense[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching expenses:", error)
    return []
  }
  return data
}

export async function getExpenseById(expenseId: string, userId: string): Promise<Expense | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("expenses").select("*").eq("id", expenseId).eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching expense by ID:", error)
    return null
  }
  return data
}
