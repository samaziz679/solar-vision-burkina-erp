import { createClient } from "@/lib/supabase/server"

export async function getExpenses(userId: string) {
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

export async function getExpenseById(id: string, userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("expenses").select("*").eq("id", id).eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching expense:", error)
    return null
  }
  return data
}
