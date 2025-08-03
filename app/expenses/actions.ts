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

const expenseSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "La description est requise."),
  amount: z.preprocess((val) => Number(val), z.number().min(0.01, "Le montant doit être un nombre positif.")),
  date: z.string().min(1, "La date est requise."),
  category: z.string().min(1, "La catégorie est requise."),
})

export async function createExpense(
  prevState: { message: string; errors?: Record<string, string[]> },
  formData: FormData,
) {
  const validatedFields = expenseSchema.safeParse({
    description: formData.get("description"),
    amount: formData.get("amount"),
    date: formData.get("date"),
    category: formData.get("category"),
  })

  if (!validatedFields.success) {
    return {
      message: "Erreurs de validation.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { description, amount, date, category } = validatedFields.data

  const { error } = await supabase.from("expenses").insert({
    description,
    amount,
    date,
    category,
  })

  if (error) {
    console.error("Error creating expense:", error)
    return { message: "Échec de la création de la dépense." }
  }

  revalidatePath("/expenses")
  redirect("/expenses")
}

export async function updateExpense(
  id: string,
  prevState: { message: string; errors?: Record<string, string[]> },
  formData: FormData,
) {
  const validatedFields = expenseSchema.safeParse({
    description: formData.get("description"),
    amount: formData.get("amount"),
    date: formData.get("date"),
    category: formData.get("category"),
  })

  if (!validatedFields.success) {
    return {
      message: "Erreurs de validation.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { description, amount, date, category } = validatedFields.data

  const { error } = await supabase
    .from("expenses")
    .update({
      description,
      amount,
      date,
      category,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating expense:", error)
    return { message: "Échec de la mise à jour de la dépense." }
  }

  revalidatePath("/expenses")
  redirect("/expenses")
}

export async function deleteExpense(id: string) {
  const { error } = await supabase.from("expenses").delete().eq("id", id)

  if (error) {
    console.error("Error deleting expense:", error)
    return { message: "Échec de la suppression de la dépense." }
  }

  revalidatePath("/expenses")
  return { message: "Dépense supprimée avec succès." }
}
