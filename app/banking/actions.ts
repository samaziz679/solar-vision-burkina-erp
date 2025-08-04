"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { BankingTransaction } from "@/lib/supabase/types"

export async function createBankingTransaction(formData: Omit<BankingTransaction, "id" | "user_id" | "created_at">) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("banking_transactions").insert({
    ...formData,
    user_id: user.id,
  })

  if (error) {
    console.error("Error creating banking transaction:", error)
    throw new Error("Failed to create banking transaction.")
  }

  revalidatePath("/banking")
}

export async function updateBankingTransaction(
  id: string,
  formData: Omit<BankingTransaction, "id" | "user_id" | "created_at">,
) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("banking_transactions").update(formData).eq("id", id).eq("user_id", user.id)

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

export async function createBankingAccount(name: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("banking_accounts").insert({
    name,
    user_id: user.id,
  })

  if (error) {
    console.error("Error creating banking account:", error)
    throw new Error("Failed to create banking account.")
  }

  revalidatePath("/banking")
}
