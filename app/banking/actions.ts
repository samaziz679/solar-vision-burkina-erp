"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import type { BankEntry } from "@/lib/supabase/types"

export async function createBankEntry(prevState: any, formData: FormData) {
  const supabase = await createServerClient()

  const date = formData.get("date") as string
  const type = formData.get("type") as BankEntry["type"]
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string

  if (!date || !type || isNaN(amount) || !description) {
    return { error: "Tous les champs requis ne sont pas remplis ou sont invalides." }
  }

  const { error } = await supabase.from("bank_entries").insert({
    date,
    type,
    amount,
    description,
  })

  if (error) {
    console.error("Error creating bank entry:", error)
    return { error: "Échec de l'ajout de l'opération bancaire. Veuillez réessayer." }
  }

  revalidatePath("/banking")
  redirect("/banking")
}

export async function updateBankEntry(prevState: any, formData: FormData) {
  const supabase = await createServerClient()

  const id = formData.get("id") as string
  const date = formData.get("date") as string
  const type = formData.get("type") as BankEntry["type"]
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string

  if (!id || !date || !type || isNaN(amount) || !description) {
    return { error: "Tous les champs requis ne sont pas remplis ou sont invalides." }
  }

  const { error } = await supabase
    .from("bank_entries")
    .update({
      date,
      type,
      amount,
      description,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating bank entry:", error)
    return { error: "Échec de la mise à jour de l'opération bancaire. Veuillez réessayer." }
  }

  revalidatePath("/banking")
  redirect("/banking")
}

export async function deleteBankEntry(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("bank_entries").delete().eq("id", id)

  if (error) {
    console.error("Error deleting bank entry:", error)
    return { error: "Échec de la suppression de l'opération bancaire. Veuillez réessayer." }
  }

  revalidatePath("/banking")
  return { success: true }
}
