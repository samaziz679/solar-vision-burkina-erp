"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/types"

export async function addBankEntry(prevState: any, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated." }
  }

  const date = formData.get("date") as string
  const type = formData.get("type") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string

  if (!date || !type || isNaN(amount) || !description) {
    return { error: "Tous les champs requis doivent être remplis." }
  }

  const { error } = await supabase.from("bank_entries").insert({
    user_id: user.id,
    date,
    type,
    amount,
    description,
  })

  if (error) {
    console.error("Error adding bank entry:", error)
    return { error: error.message }
  }

  revalidatePath("/banking")
  redirect("/banking")
}

export async function updateBankEntry(prevState: any, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated." }
  }

  const id = formData.get("id") as string
  const date = formData.get("date") as string
  const type = formData.get("type") as string
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string

  if (!id || !date || !type || isNaN(amount) || !description) {
    return { error: "Tous les champs requis doivent être remplis." }
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
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating bank entry:", error)
    return { error: error.message }
  }

  revalidatePath("/banking")
  redirect("/banking")
}

export async function deleteBankEntry(id: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not authenticated." }
  }

  const { error } = await supabase.from("bank_entries").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting bank entry:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/banking")
  return { success: true }
}
