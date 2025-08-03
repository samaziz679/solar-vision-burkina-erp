"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/types"

export async function addExpense(prevState: any, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated." }
  }

  const expense_date = formData.get("expense_date") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const notes = formData.get("notes") as string

  if (!expense_date || isNaN(amount) || !description) {
    return { error: "La date, le montant et la description sont requis." }
  }

  const { error } = await supabase.from("expenses").insert({
    user_id: user.id,
    expense_date,
    amount,
    description,
    category,
    notes,
  })

  if (error) {
    console.error("Error adding expense:", error)
    return { error: error.message }
  }

  revalidatePath("/expenses")
  redirect("/expenses")
}

export async function updateExpense(prevState: any, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated." }
  }

  const id = formData.get("id") as string
  const expense_date = formData.get("expense_date") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const notes = formData.get("notes") as string

  if (!id || !expense_date || isNaN(amount) || !description) {
    return { error: "La date, le montant et la description sont requis." }
  }

  const { error } = await supabase
    .from("expenses")
    .update({
      expense_date,
      amount,
      description,
      category,
      notes,
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating expense:", error)
    return { error: error.message }
  }

  revalidatePath("/expenses")
  redirect("/expenses")
}

export async function deleteExpense(id: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not authenticated." }
  }

  const { error } = await supabase.from("expenses").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting expense:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/expenses")
  return { success: true }
}
