"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { BankingTransaction } from "@/lib/supabase/types"

export async function createBankingTransaction(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("banking_transactions").insert({
    user_id: user.id,
    type: formData.get("type") as BankingTransaction["type"],
    amount: Number.parseFloat(formData.get("amount") as string),
    description: formData.get("description") as string,
    date: formData.get("date") as string,
    account_id: formData.get("account_id") as string,
  })

  if (error) {
    console.error("Error creating banking transaction:", error)
    throw new Error("Failed to create banking transaction.")
  }

  revalidatePath("/banking")
  redirect("/banking")
}

export async function updateBankingTransaction(id: string, formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase
    .from("banking_transactions")
    .update({
      type: formData.get("type") as BankingTransaction["type"],
      amount: Number.parseFloat(formData.get("amount") as string),
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      account_id: formData.get("account_id") as string,
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating banking transaction:", error)
    throw new Error("Failed to update banking transaction.")
  }

  revalidatePath("/banking")
  redirect("/banking")
}

export async function deleteBankingTransaction(id: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("banking_transactions").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting banking transaction:", error)
    throw new Error("Failed to delete banking transaction.")
  }

  revalidatePath("/banking")
}
