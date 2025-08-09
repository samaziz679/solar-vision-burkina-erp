"use server"

import { createClient as createSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Client } from "@/lib/supabase/types"

export async function createClient(formData: Omit<Client, "id" | "created_at" | "user_id">) {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase.from("clients").insert(formData).select().single()

  if (error) {
    console.error("Error creating client:", error)
    return { error: error.message }
  }

  revalidatePath("/clients")
  return { data }
}

export async function updateClient(id: string, formData: Partial<Omit<Client, "id" | "created_at" | "user_id">>) {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase.from("clients").update(formData).eq("id", id).select().single()

  if (error) {
    console.error("Error updating client:", error)
    return { error: error.message }
  }

  revalidatePath("/clients")
  return { data }
}

export async function deleteClient(id: string) {
  const supabase = createSupabaseClient()
  const { error } = await supabase.from("clients").delete().eq("id", id)

  if (error) {
    console.error("Error deleting client:", error)
    return { error: error.message }
  }

  revalidatePath("/clients")
  return { success: true }
}
