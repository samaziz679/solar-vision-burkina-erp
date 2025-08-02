import { createServerClient } from "@/lib/supabase/server"
import type { Expense } from "@/lib/supabase/types"

export async function getExpenses(): Promise<Expense[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("expenses").select("*").order("expense_date", { ascending: false })

  if (error) {
    console.error("Error fetching expenses:", error.message)
    return []
  }

  return data as Expense[]
}

export async function getExpenseById(id: string): Promise<Expense | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("expenses").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching expense with ID ${id}:`, error.message)
    return null
  }

  return data as Expense
}
