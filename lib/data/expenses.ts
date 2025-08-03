import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database, Expense } from "@/lib/supabase/types"

export async function getExpenses(): Promise<Expense[]> {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("expense_date", { ascending: false })

  if (error) {
    console.error("Error fetching expenses:", error)
    return []
  }

  return data as Expense[]
}

export async function getExpenseById(id: string): Promise<Expense | null> {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase.from("expenses").select("*").eq("id", id).eq("user_id", user.id).single()

  if (error) {
    console.error("Error fetching expense by ID:", error)
    return null
  }

  return data as Expense
}
