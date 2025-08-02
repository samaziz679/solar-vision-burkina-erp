"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient as createSupabaseClient } from "@/lib/supabase/server"

export async function createClient(formData: FormData) {
  const supabase = await createSupabaseClient()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string

  if (!name) {
    return { error: "Name is required." }
  }

  const { error } = await supabase.from("clients").insert({
    name,
    email,
    phone,
    address,
  })

  if (error) {
    console.error("Error creating client:", error.message)
    return { error: "Failed to create client." }
  }

  revalidatePath("/clients")
  redirect("/clients")
}

export async function updateClient(id: string, formData: FormData) {
  const supabase = await createSupabaseClient()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string

  if (!name) {
    return { error: "Name is required." }
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
    console.error("Error updating client:", error.message)
    return { error: "Failed to update client." }
  }

  revalidatePath("/clients")
  redirect("/clients")
}

export async function deleteClient(id: string) {
  const supabase = await createSupabaseClient()

  const { error } = await supabase.from("clients").delete().eq("id", id)

  if (error) {
    console.error("Error deleting client:", error.message)
    return { error: "Failed to delete client." }
  }

  revalidatePath("/clients")
  return { success: true }
}
