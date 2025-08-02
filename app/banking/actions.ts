"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { BankEntry } from "@/lib/supabase/types"

export async function createBankEntry(formData: FormData) {
  const supabase = await createClient()

  const date = formData.get("date") as string
  const description = formData.get("description") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const type = formData.get("type") as BankEntry["type"]

  if (!date || !description || isNaN(amount) || !type) {
    return { error: "All fields are required." }
  }

  const { error } = await supabase.from("bank_entries").insert({
    date,
    description,
    amount,
    type,
  })

  if (error) {
    console.error("Error creating bank entry:", error.message)
    return { error: "Failed to create bank entry." }
  }

  revalidatePath("/banking")
  redirect("/banking")
}

export async function updateBankEntry(id: string, formData: FormData) {
  const supabase = await createClient()

  const date = formData.get("date") as string
  const description = formData.get("description") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const type = formData.get("type") as BankEntry["type"]

  if (!date || !description || isNaN(amount) || !type) {
    return { error: "All fields are required." }
  }

  const { error } = await supabase
    .from("bank_entries")
    .update({
      date,
      description,
      amount,
      type,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating bank entry:", error.message)
    return { error: "Failed to update bank entry." }
  }

  revalidatePath("/banking")
  redirect("/banking")
}

export async function deleteBankEntry(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("bank_entries").delete().eq("id", id)

  if (error) {
    console.error("Error deleting bank entry:", error.message)
    return { error: "Failed to delete bank entry." }
  }

  revalidatePath("/banking")
  return { success: true }
}
