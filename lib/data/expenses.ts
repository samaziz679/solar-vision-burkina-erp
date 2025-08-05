import { createClient } from "@/lib/supabase/server"
import type { Expense } from "@/lib/supabase/types"
import { getUser } from "@/lib/auth"

export async function getExpenses(): Promise<Expense[]> {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching expenses:", error.message)
    return []
  }
  return data || []
}

export async function getExpenseById(id: string): Promise<Expense | null> {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase.from("expenses").select("*").eq("id", id).eq("user_id", user.id).single()

  if (error) {
    console.error("Error fetching expense by ID:", error.message)
    return null
  }
  return data || null
}
