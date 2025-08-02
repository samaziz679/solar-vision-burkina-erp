"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import type { Database } from "@/lib/supabase/types"

type ExpenseInsert = Database["public"]["Tables"]["expenses"]["Insert"]
type ExpenseUpdate = Database["public"]["Tables"]["expenses"]["Update"]

export async function createExpense(prevState: any, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const description = formData.get("description") as string
  const category = formData.get("category") as ExpenseInsert["category"]
  const amount = Number.parseFloat(formData.get("amount") as string)
  const expense_date = formData.get("expense_date") as string
  const notes = formData.get("notes") as string | null

  if (!description || !category || isNaN(amount) || amount <= 0 || !expense_date) {
    return {
      success: false,
      error: "Veuillez remplir tous les champs obligatoires et s'assurer que le montant est valide.",
    }
  }

  const newExpense: ExpenseInsert = {
    description,
    category,
    amount,
    expense_date,
    notes,
    created_by: user.id,
  }

  const supabase = await createServerClient()
  const { error } = await supabase.from("expenses").insert(newExpense)

  if (error) {
    console.error("Error creating expense:", error.message)
    return { success: false, error: "Échec de l'enregistrement de la dépense: " + error.message }
  }

  revalidatePath("/expenses")
  return { success: true, message: "Dépense enregistrée avec succès!" }
}

export async function updateExpense(prevState: any, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const id = formData.get("id") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as ExpenseUpdate["category"]
  const amount = Number.parseFloat(formData.get("amount") as string)
  const expense_date = formData.get("expense_date") as string
  const notes = formData.get("notes") as string | null

  if (!description || !category || isNaN(amount) || amount <= 0 || !expense_date) {
    return {
      success: false,
      error: "Veuillez remplir tous les champs obligatoires et s'assurer que le montant est valide.",
    }
  }

  const updatedExpense: ExpenseUpdate = {
    description,
    category,
    amount,
    expense_date,
    notes,
  }

  const supabase = await createServerClient()
  const { error } = await supabase.from("expenses").update(updatedExpense).eq("id", id)

  if (error) {
    console.error("Error updating expense:", error.message)
    return { success: false, error: "Échec de la mise à jour de la dépense: " + error.message }
  }

  revalidatePath("/expenses")
  revalidatePath(`/expenses/${id}/edit`)
  return { success: true, message: "Dépense mise à jour avec succès!" }
}

export async function deleteExpense(prevState: any, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const id = formData.get("id") as string

  const supabase = await createServerClient()
  const { error } = await supabase.from("expenses").delete().eq("id", id)

  if (error) {
    console.error("Error deleting expense:", error.message)
    return { success: false, error: "Échec de la suppression de la dépense: " + error.message }
  }

  revalidatePath("/expenses")
  return { success: true, message: "Dépense supprimée avec succès!" }
}

