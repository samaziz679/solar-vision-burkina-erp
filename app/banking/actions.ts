"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/auth"
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/types"

export async function createBankingAccount(formData: FormData) {
  const supabase = createClient()
  const user = await getUser()

  const name = formData.get("name") as string

  if (!name) {
    return { success: false, error: "Account name is required." }
  }

  const newAccount: TablesInsert<"banking_accounts"> = {
    user_id: user.id,
    name,
  }

  const { error } = await supabase.from("banking_accounts").insert(newAccount)

  if (error) {
    console.error("Error creating banking account:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/banking")
  return { success: true }
}

export async function updateBankingAccount(id: string, formData: FormData) {
  const supabase = createClient()
  const user = await getUser()

  const name = formData.get("name") as string

  if (!name) {
    return { success: false, error: "Account name is required." }
  }

  const updatedAccount: TablesUpdate<"banking_accounts"> = {
    name,
  }

  const { error } = await supabase.from("banking_accounts").update(updatedAccount).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating banking account:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/banking")
  revalidatePath(`/banking/${id}/edit`)
  return { success: true }
}

export async function deleteBankingAccount(id: string) {
  const supabase = createClient()
  const user = await getUser()

  const { error } = await supabase.from("banking_accounts").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting banking account:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/banking")
  return { success: true }
}

export async function createBankingTransaction(formData: FormData) {
  const supabase = createClient()
  const user = await getUser()

  const account_id = formData.get("account_id") as string
  const type = formData.get("type") as TablesInsert<"banking_transactions">["type"]
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string
  const date = formData.get("date") as string

  if (!account_id || !type || isNaN(amount) || amount <= 0 || !description || !date) {
    return { success: false, error: "All fields are required and amount must be positive." }
  }

  const newTransaction: TablesInsert<"banking_transactions"> = {
    user_id: user.id,
    account_id,
    type,
    amount,
    description,
    date,
  }

  const { error } = await supabase.from("banking_transactions").insert(newTransaction)

  if (error) {
    console.error("Error creating banking transaction:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/banking")
  revalidatePath(`/banking/${account_id}/edit`)
  return { success: true }
}

export async function updateBankingTransaction(id: string, formData: FormData) {
  const supabase = createClient()
  const user = await getUser()

  const account_id = formData.get("account_id") as string
  const type = formData.get("type") as TablesUpdate<"banking_transactions">["type"]
  const amount = Number.parseFloat(formData.get("amount") as string)
  const description = formData.get("description") as string
  const date = formData.get("date") as string

  if (!account_id || !type || isNaN(amount) || amount <= 0 || !description || !date) {
    return { success: false, error: "All fields are required and amount must be positive." }
  }

  const updatedTransaction: TablesUpdate<"banking_transactions"> = {
    account_id,
    type,
    amount,
    description,
    date,
  }

  const { error } = await supabase
    .from("banking_transactions")
    .update(updatedTransaction)
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating banking transaction:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/banking")
  revalidatePath(`/banking/${account_id}/edit`)
  return { success: true }
}

export async function deleteBankingTransaction(id: string, accountId: string) {
  const supabase = createClient()
  const user = await getUser()

  const { error } = await supabase.from("banking_transactions").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting banking transaction:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/banking")
  revalidatePath(`/banking/${accountId}/edit`)
  return { success: true }
}
