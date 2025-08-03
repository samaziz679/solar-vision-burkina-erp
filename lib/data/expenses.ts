import { createServerClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import type { Expense } from "@/lib/supabase/types"

export async function getExpenses(): Promise<Expense[]> {
  noStore()
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("expenses").select("*").order("expense_date", { ascending: false })

  if (error) {
    console.error("Database Error:", error)
    return []
  }
  return data as Expense[]
}

export async function getExpenseById(id: string): Promise<Expense | null> {
  noStore()
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("expenses").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error:", error)
    return null
  }
  return data as Expense
}
