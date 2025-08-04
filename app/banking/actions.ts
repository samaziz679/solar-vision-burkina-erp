"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { BankingTransaction } from "@/lib/supabase/types"

export async function createBankingTransaction(
  values: Omit<BankingTransaction, "id" | "user_id" | "created_at" | "total_amount">,
) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("banking_transactions").insert({
    ...values,
    user_id: user.id,
    total_amount: values.amount, // Assuming total_amount is the same as amount for simplicity
  })

  if (error) {
    console.error("Error creating banking transaction:", error)
    throw new Error("Failed to create banking transaction.")
  }

  revalidatePath("/banking")
}

export async function updateBankingTransaction(
  id: string,
  values: Omit<BankingTransaction, "user_id" | "created_at" | "total_amount">,
) {
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
      ...values,
      total_amount: values.amount, // Assuming total_amount is the same as amount for simplicity
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating banking transaction:", error)
    throw new Error("Failed to update banking transaction.")
  }

  revalidatePath("/banking")
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
