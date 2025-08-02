"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const FormSchema = z.object({
  id: z.string().optional(),
  date: z.string().min(1, "La date est requise."),
  description: z.string().min(1, "La description est requise."),
  amount: z.coerce.number().min(0.01, "Le montant doit être positif."),
  type: z.enum(["deposit", "withdrawal"], {
    invalid_type_error: "Le type doit être 'deposit' ou 'withdrawal'.",
    required_error: "Le type est requis.",
  }),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

const CreateBankEntry = FormSchema.omit({ id: true, created_at: true, updated_at: true })
const UpdateBankEntry = FormSchema.omit({ created_at: true, updated_at: true })

export type State = {
  errors?: {
    date?: string[]
    description?: string[]
    amount?: string[]
    type?: string[]
  }
  message?: string | null
}

export async function createBankEntry(prevState: State, formData: FormData) {
  const validatedFields = CreateBankEntry.safeParse({
    date: formData.get("date"),
    description: formData.get("description"),
    amount: formData.get("amount"),
    type: formData.get("type"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Champs manquants. Échec de la création de l'entrée bancaire.",
    }
  }

  const { date, description, amount, type } = validatedFields.data
  const supabase = createClient()

  const { error } = await supabase.from("bank_entries").insert({
    date,
    description,
    amount,
    type,
  })

  if (error) {
    console.error("Database Error:", error)
    return {
      message: "Erreur de base de données: Échec de la création de l'entrée bancaire.",
    }
  }

  revalidatePath("/banking")
  redirect("/banking")
}

export async function updateBankEntry(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateBankEntry.safeParse({
    id: formData.get("id"),
    date: formData.get("date"),
    description: formData.get("description"),
    amount: formData.get("amount"),
    type: formData.get("type"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Champs manquants. Échec de la mise à jour de l'entrée bancaire.",
    }
  }

  const { date, description, amount, type } = validatedFields.data
  const supabase = createClient()

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
    console.error("Database Error:", error)
    return {
      message: "Erreur de base de données: Échec de la mise à jour de l'entrée bancaire.",
    }
  }

  revalidatePath("/banking")
  revalidatePath(`/banking/${id}/edit`)
  redirect("/banking")
}

export async function deleteBankEntry(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("bank_entries").delete().eq("id", id)

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to delete bank entry.")
  }

  revalidatePath("/banking")
}
