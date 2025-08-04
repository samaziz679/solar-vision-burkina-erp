"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const bankingSchema = z.object({
  account_name: z.string().min(1, "Account name is required").max(255),
  account_number: z.string().min(1, "Account number is required").max(255),
  bank_name: z.string().min(1, "Bank name is required").max(255),
  balance: z.coerce.number().min(0, "Balance cannot be negative"),
})

const bankingTransactionSchema = z.object({
  type: z.enum(["income", "expense", "transfer"]),
  amount: z.coerce.number().min(0.01, "Amount must be positive"),
  description: z.string().min(1, "Description is required").max(255),
  date: z.string().min(1, "Date is required"),
  account_id: z.string().min(1, "Account is required"),
})

export async function createBankingAccount(prevState: any, formData: FormData) {
  const validatedFields = bankingSchema.safeParse({
    account_name: formData.get("account_name"),
    account_number: formData.get("account_number"),
    bank_name: formData.get("bank_name"),
    balance: formData.get("balance"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Banking Account.",
    }
  }

  const { account_name, account_number, bank_name, balance } = validatedFields.data
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { message: "User not authenticated." }
  }

  const { error } = await supabase.from("banking_accounts").insert({
    account_name,
    account_number,
    bank_name,
    balance,
    user_id: user.id,
  })

  if (error) {
    console.error("Error creating banking account:", error)
    return { message: "Database Error: Failed to Create Banking Account." }
  }

  revalidatePath("/banking")
  redirect("/banking")
}

export async function updateBankingAccount(id: string, prevState: any, formData: FormData) {
  const validatedFields = bankingSchema.safeParse({
    account_name: formData.get("account_name"),
    account_number: formData.get("account_number"),
    bank_name: formData.get("bank_name"),
    balance: formData.get("balance"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Banking Account.",
    }
  }

  const { account_name, account_number, bank_name, balance } = validatedFields.data
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { message: "User not authenticated." }
  }

  const { error } = await supabase
    .from("banking_accounts")
    .update({
      account_name,
      account_number,
      bank_name,
      balance,
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating banking account:", error)
    return { message: "Database Error: Failed to Update Banking Account." }
  }

  revalidatePath("/banking")
  redirect("/banking")
}

export async function deleteBankingAccount(id: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { message: "User not authenticated." }
  }

  const { error } = await supabase.from("banking_accounts").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting banking account:", error)
    return { message: "Database Error: Failed to Delete Banking Account." }
  }

  revalidatePath("/banking")
  return { message: "Banking account deleted successfully." }
}

export async function createBankingTransaction(values: z.infer<typeof bankingTransactionSchema>) {
  const validatedFields = bankingTransactionSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Banking Transaction.",
    }
  }

  const { type, amount, description, date, account_id } = validatedFields.data
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { message: "User not authenticated." }
  }

  const { error } = await supabase.from("banking_transactions").insert({
    type,
    amount,
    description,
    date,
    account_id,
    user_id: user.id,
  })

  if (error) {
    console.error("Error creating banking transaction:", error)
    return { message: "Database Error: Failed to Create Banking Transaction." }
  }

  revalidatePath("/banking")
  redirect("/banking")
}

export async function updateBankingTransaction(id: string, values: z.infer<typeof bankingTransactionSchema>) {
  const validatedFields = bankingTransactionSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Banking Transaction.",
    }
  }

  const { type, amount, description, date, account_id } = validatedFields.data
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { message: "User not authenticated." }
  }

  const { error } = await supabase
    .from("banking_transactions")
    .update({
      type,
      amount,
      description,
      date,
      account_id,
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating banking transaction:", error)
    return { message: "Database Error: Failed to Update Banking Transaction." }
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
    return { message: "User not authenticated." }
  }

  const { error } = await supabase.from("banking_transactions").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting banking transaction:", error)
    return { message: "Database Error: Failed to Delete Banking Transaction." }
  }

  revalidatePath("/banking")
  return { message: "Banking transaction deleted successfully." }
}
