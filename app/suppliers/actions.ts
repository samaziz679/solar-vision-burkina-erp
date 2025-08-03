"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"

export async function createSupplier(prevState: any, formData: FormData) {
  const supabase = await createServerClient()

  const name = formData.get("name") as string
  const contact_person = formData.get("contact_person") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string

  if (!name) {
    return { error: "Le nom du fournisseur est requis." }
  }

  const { error } = await supabase.from("suppliers").insert({
    name,
    contact_person,
    email,
    phone,
    address,
  })

  if (error) {
    console.error("Error creating supplier:", error)
    return { error: "Échec de l'ajout du fournisseur. Veuillez réessayer." }
  }

  revalidatePath("/suppliers")
  redirect("/suppliers")
}

export async function updateSupplier(prevState: any, formData: FormData) {
  const supabase = await createServerClient()

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const contact_person = formData.get("contact_person") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string

  if (!id || !name) {
    return { error: "Le nom du fournisseur est requis." }
  }

  const { error } = await supabase
    .from("suppliers")
    .update({
      name,
      contact_person,
      email,
      phone,
      address,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating supplier:", error)
    return { error: "Échec de la mise à jour du fournisseur. Veuillez réessayer." }
  }

  revalidatePath("/suppliers")
  redirect("/suppliers")
}

export async function deleteSupplier(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("suppliers").delete().eq("id", id)

  if (error) {
    console.error("Error deleting supplier:", error)
    return { error: "Échec de la suppression du fournisseur. Veuillez réessayer." }
  }

  revalidatePath("/suppliers")
  return { success: true }
}
