"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"

export async function createExpense(prevState: any, formData: FormData) {
  const supabase = await createServerClient()

  const expense_date = formData.get("expense_date") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const notes = formData.get("notes") as string

  if (!expense_date || isNaN(amount) || !description) {
    return { error: "Tous les champs requis ne sont pas remplis ou sont invalides." }
  }

  const { error } = await supabase.from("expenses").insert({
    expense_date,
    amount,
    description,
    category,
    notes,
  })

  if (error) {
    console.error("Error creating expense:", error)
    return { error: "Échec de l'ajout de la dépense. Veuillez réessayer." }
  }

  revalidatePath("/expenses")
  redirect("/expenses")
}

export async function updateExpense(prevState: any, formData: FormData) {
  const supabase = await createServerClient()

  const id = formData.get("id") as string
  const expense_date = formData.get("expense_date") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const notes = formData.get("notes") as string

  if (!id || !expense_date || isNaN(amount) || !description) {
    return { error: "Tous les champs requis ne sont pas remplis ou sont invalides." }
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

  if (error) {
    console.error("Error updating expense:", error)
    return { error: "Échec de la mise à jour de la dépense. Veuillez réessayer." }
  }

  revalidatePath("/expenses")
  redirect("/expenses")
}

export async function deleteExpense(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("expenses").delete().eq("id", id)

  if (error) {
    console.error("Error deleting expense:", error)
    return { error: "Échec de la suppression de la dépense. Veuillez réessayer." }
  }

  revalidatePath("/expenses")
  return { success: true }
}
