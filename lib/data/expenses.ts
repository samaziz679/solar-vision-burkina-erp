import { createServerClient } from "@/lib/supabase/server"
import { unstable_cache } from "next/cache"
import type { Expense } from "@/lib/supabase/types"

export const getExpenses = unstable_cache(
  async () => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("expenses").select("*").order("expense_date", { ascending: false })

    if (error) {
      console.error("Error fetching expenses:", error)
      return []
    }

    return data as Expense[]
  },
  ["expenses"],
  {
    tags: ["expenses"],
  },
)

export const getExpenseById = unstable_cache(
  async (id: string) => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("expenses").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching expense:", error)
      return null
    }

    return data as Expense
  },
  ["expense"],
  {
    tags: ["expense"],
  },
)
