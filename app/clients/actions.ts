"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient as createSupabaseClient } from "@/lib/supabase/server"

export async function createClient(prevState: any, formData: FormData) {
  const supabase = await createSupabaseClient()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string

  if (!name) {
    return { error: "Le nom du client est requis." }
  }

  const { error } = await supabase.from("clients").insert({
    name,
    email,
    phone,
    address,
  })

  if (error) {
    console.error("Error creating client:", error)
    return { error: "Échec de l'ajout du client. Veuillez réessayer." }
  }

  revalidatePath("/clients")
  redirect("/clients")
}

export async function updateClient(prevState: any, formData: FormData) {
  const supabase = await createSupabaseClient()

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string

  if (!id || !name) {
    return { error: "Le nom du client est requis." }
  }

  const { error } = await supabase
    .from("clients")
    .update({
      name,
      email,
      phone,
      address,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating client:", error)
    return { error: "Échec de la mise à jour du client. Veuillez réessayer." }
  }

  revalidatePath("/clients")
  redirect("/clients")
}

export async function deleteClient(id: string) {
  const supabase = await createSupabaseClient()

  const { error } = await supabase.from("clients").delete().eq("id", id)

  if (error) {
    console.error("Error deleting client:", error)
    return { error: "Échec de la suppression du client. Veuillez réessayer." }
  }

  revalidatePath("/clients")
  return { success: true }
}
