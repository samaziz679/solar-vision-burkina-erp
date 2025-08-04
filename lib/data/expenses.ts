import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import type { Expense } from "@/lib/supabase/types"

export async function getExpenses(userId: string): Promise<Expense[]> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching expenses:", error)
    throw new Error("Failed to fetch expenses.")
  }
  return data
}

export async function getExpenseById(id: string, userId: string): Promise<Expense | null> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("expenses").select("*").eq("id", id).eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching expense:", error)
    return null
  }
  return data
}
