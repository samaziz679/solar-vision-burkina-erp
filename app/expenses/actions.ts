"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Expense } from "@/lib/supabase/types"

export async function createExpense(values: Omit<Expense, "id" | "user_id" | "created_at">) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("expenses").insert({
    ...values,
    user_id: user.id,
  })

  if (error) {
    console.error("Error creating expense:", error)
    throw new Error("Failed to create expense.")
  }

  revalidatePath("/expenses")
}

export async function updateExpense(id: string, values: Omit<Expense, "user_id" | "created_at">) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("expenses").update(values).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating expense:", error)
    throw new Error("Failed to update expense.")
  }

  revalidatePath("/expenses")
}

export async function deleteExpense(id: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("expenses").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting expense:", error)
    throw new Error("Failed to delete expense.")
  }

  revalidatePath("/expenses")
}
