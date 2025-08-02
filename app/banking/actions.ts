"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { BankEntry } from "@/lib/supabase/types"

export async function createBankEntry(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const date = formData.get("date") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string
  const type = formData.get("type") as BankEntry["type"]

  if (!date || isNaN(amount) || !description || !type) {
    return { error: "Tous les champs sont requis." }
  }

  const { error } = await supabase.from("bank_entries").insert({
    date,
    amount,
    description,
    type,
  })

  if (error) {
    console.error("Error creating bank entry:", error)
    return { error: "Échec de l'ajout de l'entrée bancaire. Veuillez réessayer." }
  }

  revalidatePath("/banking")
  redirect("/banking")
}

export async function updateBankEntry(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const id = formData.get("id") as string
  const date = formData.get("date") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string
  const type = formData.get("type") as BankEntry["type"]

  if (!id || !date || isNaN(amount) || !description || !type) {
    return { error: "Tous les champs sont requis." }
  }

  const { error } = await supabase
    .from("bank_entries")
    .update({
      date,
      amount,
      description,
      type,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating bank entry:", error)
    return { error: "Échec de la mise à jour de l'entrée bancaire. Veuillez réessayer." }
  }

  revalidatePath("/banking")
  redirect("/banking")
}

export async function deleteBankEntry(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("bank_entries").delete().eq("id", id)

  if (error) {
    console.error("Error deleting bank entry:", error)
    return { error: "Échec de la suppression de l'entrée bancaire. Veuillez réessayer." }
  }

  revalidatePath("/banking")
  return { success: true }
}
