"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/types"

export async function addClient(prevState: any, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated." }
  }

  const name = formData.get("name") as string
  const contact = formData.get("contact") as string
  const email = formData.get("email") as string
  const address = formData.get("address") as string

  if (!name || !contact) {
    return { error: "Le nom et le contact sont requis." }
  }

  const { error } = await supabase.from("clients").insert({
    user_id: user.id,
    name,
    contact,
    email,
    address,
  })

  if (error) {
    console.error("Error adding client:", error)
    return { error: error.message }
  }

  revalidatePath("/clients")
  redirect("/clients")
}

export async function updateClient(prevState: any, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated." }
  }

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const contact = formData.get("contact") as string
  const email = formData.get("email") as string
  const address = formData.get("address") as string

  if (!id || !name || !contact) {
    return { error: "Le nom et le contact sont requis." }
  }

  const { error } = await supabase
    .from("clients")
    .update({
      name,
      contact,
      email,
      address,
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating client:", error)
    return { error: error.message }
  }

  revalidatePath("/clients")
  redirect("/clients")
}

export async function deleteClient(id: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not authenticated." }
  }

  const { error } = await supabase.from("clients").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting client:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/clients")
  return { success: true }
}
