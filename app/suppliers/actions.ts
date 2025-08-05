"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/auth"
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/types"

export async function createSupplier(formData: FormData) {
  const supabase = createClient()
  const user = await getUser()

  const name = formData.get("name") as string
  const contact_person = formData.get("contact_person") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string

  if (!name || !contact_person || !email || !phone || !address) {
    return { success: false, error: "All fields are required." }
  }

  const newSupplier: TablesInsert<"suppliers"> = {
    user_id: user.id,
    name,
    contact_person,
    email,
    phone,
    address,
  }

  const { error } = await supabase.from("suppliers").insert(newSupplier)

  if (error) {
    console.error("Error creating supplier:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/suppliers")
  return { success: true }
}

export async function updateSupplier(id: string, formData: FormData) {
  const supabase = createClient()
  const user = await getUser()

  const name = formData.get("name") as string
  const contact_person = formData.get("contact_person") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string

  if (!name || !contact_person || !email || !phone || !address) {
    return { success: false, error: "All fields are required." }
  }

  const updatedSupplier: TablesUpdate<"suppliers"> = {
    name,
    contact_person,
    email,
    phone,
    address,
  }

  const { error } = await supabase.from("suppliers").update(updatedSupplier).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating supplier:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/suppliers")
  revalidatePath(`/suppliers/${id}/edit`)
  return { success: true }
}

export async function deleteSupplier(id: string) {
  const supabase = createClient()
  const user = await getUser()

  const { error } = await supabase.from("suppliers").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting supplier:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/suppliers")
  return { success: true }
}
