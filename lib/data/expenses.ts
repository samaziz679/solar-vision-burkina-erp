import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/lib/supabase/types"

type Expense = Tables<"expenses">

export async function getExpenses(userId: string): Promise<Expense[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching expenses:", error)
    return []
  }
  return data
}

export async function getExpenseById(id: string, userId: string): Promise<Expense | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("expenses").select("*").eq("id", id).eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching expense by ID:", error)
    return null
  }
  return data
}
