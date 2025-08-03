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

const supplierSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Le nom du fournisseur est requis."),
  contact_person: z.string().min(1, "La personne de contact est requise."),
  email: z.string().email("Email invalide.").optional().or(z.literal("")),
  phone: z.string().min(1, "Le numéro de téléphone est requis."),
  address: z.string().min(1, "L'adresse est requise."),
})

export async function createSupplier(
  prevState: { message: string; errors?: Record<string, string[]> },
  formData: FormData,
) {
  const validatedFields = supplierSchema.safeParse({
    name: formData.get("name"),
    contact_person: formData.get("contact_person"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  })

  if (!validatedFields.success) {
    return {
      message: "Erreurs de validation.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, contact_person, email, phone, address } = validatedFields.data

  const { error } = await supabase.from("suppliers").insert({
    name,
    contact_person,
    email: email || null, // Store empty string as null
    phone,
    address,
  })

  if (error) {
    console.error("Error creating supplier:", error)
    return { message: "Échec de la création du fournisseur." }
  }

  revalidatePath("/suppliers")
  redirect("/suppliers")
}

export async function updateSupplier(
  id: string,
  prevState: { message: string; errors?: Record<string, string[]> },
  formData: FormData,
) {
  const validatedFields = supplierSchema.safeParse({
    name: formData.get("name"),
    contact_person: formData.get("contact_person"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  })

  if (!validatedFields.success) {
    return {
      message: "Erreurs de validation.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, contact_person, email, phone, address } = validatedFields.data

  const { error } = await supabase
    .from("suppliers")
    .update({
      name,
      contact_person,
      email: email || null, // Store empty string as null
      phone,
      address,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating supplier:", error)
    return { message: "Échec de la mise à jour du fournisseur." }
  }

  revalidatePath("/suppliers")
  redirect("/suppliers")
}

export async function deleteSupplier(id: string) {
  const { error } = await supabase.from("suppliers").delete().eq("id", id)

  if (error) {
    console.error("Error deleting supplier:", error)
    return { message: "Échec de la suppression du fournisseur." }
  }

  revalidatePath("/suppliers")
  return { message: "Fournisseur supprimé avec succès." }
}
