import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import type { Expense } from "@/lib/supabase/types"

export async function getExpenses() {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("expenses").select("*").order("date", { ascending: false })

  if (error) {
    console.error("Error fetching expenses:", error)
    return []
  }

  return data as Expense[]
}

export async function getExpenseById(id: string) {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("expenses").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching expense:", error)
    return null
  }

  return data as Expense
}
