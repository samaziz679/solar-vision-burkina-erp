"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/auth"
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/types"

export async function createExpense(formData: FormData) {
  const supabase = createClient()
  const user = await getUser()

  const amount = Number.parseFloat(formData.get("amount") as string)
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const date = formData.get("date") as string

  if (isNaN(amount) || amount <= 0 || !category || !description || !date) {
    return { success: false, error: "All fields are required and amount must be positive." }
  }

  const newExpense: TablesInsert<"expenses"> = {
    user_id: user.id,
    amount,
    category,
    description,
    date,
  }

  const { error } = await supabase.from("expenses").insert(newExpense)

  if (error) {
    console.error("Error creating expense:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/expenses")
  return { success: true }
}

export async function updateExpense(id: string, formData: FormData) {
  const supabase = createClient()
  const user = await getUser()

  const amount = Number.parseFloat(formData.get("amount") as string)
  const category = formData.get("category") as string
  const description = formData.get("description") as string
  const date = formData.get("date") as string

  if (isNaN(amount) || amount <= 0 || !category || !description || !date) {
    return { success: false, error: "All fields are required and amount must be positive." }
  }

  const updatedExpense: TablesUpdate<"expenses"> = {
    amount,
    category,
    description,
    date,
  }

  const { error } = await supabase.from("expenses").update(updatedExpense).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating expense:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/expenses")
  revalidatePath(`/expenses/${id}/edit`)
  return { success: true }
}

export async function deleteExpense(id: string) {
  const supabase = createClient()
  const user = await getUser()

  const { error } = await supabase.from("expenses").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting expense:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/expenses")
  return { success: true }
}
