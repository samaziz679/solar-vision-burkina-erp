"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"

const cookieStore = cookies()
const supabase = createServerClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  cookies: {
    get(name: string) {
      return cookieStore.get(name)?.value
    },
    set(name: string, value: string, options: any) {
      cookieStore.set({ name, value, ...options })
    },
    remove(name: string, options: any) {
      cookieStore.delete({ name, ...options })
    },
  },
})

const bankingSchema = z.object({
  id: z.string().optional(),
  account_name: z.string().min(1, "Le nom du compte est requis."),
  account_number: z.string().min(1, "Le numéro de compte est requis."),
  bank_name: z.string().min(1, "Le nom de la banque est requis."),
  balance: z.preprocess((val) => Number(val), z.number().min(0, "Le solde doit être un nombre positif.")),
})

export async function createBankingAccount(
  prevState: { message: string; errors?: Record<string, string[]> },
  formData: FormData,
) {
  const validatedFields = bankingSchema.safeParse({
    account_name: formData.get("account_name"),
    account_number: formData.get("account_number"),
    bank_name: formData.get("bank_name"),
    balance: formData.get("balance"),
  })

  if (!validatedFields.success) {
    return {
      message: "Erreurs de validation.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { account_name, account_number, bank_name, balance } = validatedFields.data

  const { error } = await supabase.from("banking_accounts").insert({
    account_name,
    account_number,
    bank_name,
    balance,
  })

  if (error) {
    console.error("Error creating banking account:", error)
    return { message: "Échec de la création du compte bancaire." }
  }

  revalidatePath("/banking")
  redirect("/banking")
}

export async function updateBankingAccount(
  id: string,
  prevState: { message: string; errors?: Record<string, string[]> },
  formData: FormData,
) {
  const validatedFields = bankingSchema.safeParse({
    account_name: formData.get("account_name"),
    account_number: formData.get("account_number"),
    bank_name: formData.get("bank_name"),
    balance: formData.get("balance"),
  })

  if (!validatedFields.success) {
    return {
      message: "Erreurs de validation.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { account_name, account_number, bank_name, balance } = validatedFields.data

  const { error } = await supabase
    .from("banking_accounts")
    .update({
      account_name,
      account_number,
      bank_name,
      balance,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating banking account:", error)
    return { message: "Échec de la mise à jour du compte bancaire." }
  }

  revalidatePath("/banking")
  redirect("/banking")
}

export async function deleteBankingAccount(id: string) {
  const { error } = await supabase.from("banking_accounts").delete().eq("id", id)

  if (error) {
    console.error("Error deleting banking account:", error)
    return { message: "Échec de la suppression du compte bancaire." }
  }

  revalidatePath("/banking")
  return { message: "Compte bancaire supprimé avec succès." }
}
