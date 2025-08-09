"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Expense } from "@/lib/supabase/types"

export async function createExpense(formData: Omit<Expense, "id" | "created_at" | "user_id">) {
  const supabase = createClient()
  const { data, error } = await supabase.from("expenses").insert(formData).select().single()

  if (error) {
    console.error("Error creating expense:", error)
    return { error: error.message }
  }

  revalidatePath("/expenses")
  return { data }
}

export async function updateExpense(id: string, formData: Partial<Omit<Expense, "id" | "created_at" | "user_id">>) {
  const supabase = createClient()
  const { data, error } = await supabase.from("expenses").update(formData).eq("id", id).select().single()

  if (error) {
    console.error("Error updating expense:", error)
    return { error: error.message }
  }

  revalidatePath("/expenses")
  return { data }
}

export async function deleteExpense(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("expenses").delete().eq("id", id)

  if (error) {
    console.error("Error deleting expense:", error)
    return { error: error.message }
  }

  revalidatePath("/expenses")
  return { success: true }
}
