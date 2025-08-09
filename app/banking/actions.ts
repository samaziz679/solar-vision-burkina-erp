"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Banking } from "@/lib/supabase/types"

export async function createBankingEntry(formData: Omit<Banking, "id" | "created_at" | "user_id">) {
  const supabase = createClient()
  const { data, error } = await supabase.from("banking").insert(formData).select().single()

  if (error) {
    console.error("Error creating banking entry:", error)
    return { error: error.message }
  }

  revalidatePath("/banking")
  return { data }
}

export async function updateBankingEntry(
  id: string,
  formData: Partial<Omit<Banking, "id" | "created_at" | "user_id">>,
) {
  const supabase = createClient()
  const { data, error } = await supabase.from("banking").update(formData).eq("id", id).select().single()

  if (error) {
    console.error("Error updating banking entry:", error)
    return { error: error.message }
  }

  revalidatePath("/banking")
  return { data }
}

export async function deleteBankingEntry(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("banking").delete().eq("id", id)

  if (error) {
    console.error("Error deleting banking entry:", error)
    return { error: error.message }
  }

  revalidatePath("/banking")
  return { success: true }
}
