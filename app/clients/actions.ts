"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createSupabaseClient } from "@/lib/supabase/server"
import type { Client } from "@/lib/supabase/types"

export async function createClient(values: Omit<Client, "id" | "user_id" | "created_at">) {
  const supabase = createSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("clients").insert({
    ...values,
    user_id: user.id,
  })

  if (error) {
    console.error("Error creating client:", error)
    throw new Error("Failed to create client.")
  }

  revalidatePath("/clients")
}

export async function updateClient(id: string, values: Omit<Client, "user_id" | "created_at">) {
  const supabase = createSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("clients").update(values).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating client:", error)
    throw new Error("Failed to update client.")
  }

  revalidatePath("/clients")
}

export async function deleteClient(id: string) {
  const supabase = createSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("clients").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting client:", error)
    throw new Error("Failed to delete client.")
  }

  revalidatePath("/clients")
}
