"use server"

import { revalidatePath } from "next/cache"
import { createClient as createSupabaseClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/auth"
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/types"

export async function createClient(formData: FormData) {
  const supabase = createSupabaseClient()
  const user = await getUser()

  const name = formData.get("name") as string
  const contact_person = formData.get("contact_person") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string

  if (!name || !contact_person || !email || !phone || !address) {
    return { success: false, error: "All fields are required." }
  }

  const newClient: TablesInsert<"clients"> = {
    user_id: user.id,
    name,
    contact_person,
    email,
    phone,
    address,
  }

  const { error } = await supabase.from("clients").insert(newClient)

  if (error) {
    console.error("Error creating client:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/clients")
  return { success: true }
}

export async function updateClient(id: string, formData: FormData) {
  const supabase = createSupabaseClient()
  const user = await getUser()

  const name = formData.get("name") as string
  const contact_person = formData.get("contact_person") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string

  if (!name || !contact_person || !email || !phone || !address) {
    return { success: false, error: "All fields are required." }
  }

  const updatedClient: TablesUpdate<"clients"> = {
    name,
    contact_person,
    email,
    phone,
    address,
  }

  const { error } = await supabase.from("clients").update(updatedClient).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating client:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/clients")
  revalidatePath(`/clients/${id}/edit`)
  return { success: true }
}

export async function deleteClient(id: string) {
  const supabase = createSupabaseClient()
  const user = await getUser()

  const { error } = await supabase.from("clients").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting client:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/clients")
  return { success: true }
}
