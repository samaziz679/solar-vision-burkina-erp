"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Sale } from "@/lib/supabase/types"

export async function createSale(formData: Omit<Sale, "id" | "user_id" | "created_at">) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("sales").insert({ ...formData, user_id: user.id })

  if (error) {
    console.error("Error creating sale:", error)
    throw new Error("Failed to create sale.")
  }

  revalidatePath("/sales")
}

export async function updateSale(id: string, formData: Omit<Sale, "id" | "user_id" | "created_at">) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("sales").update(formData).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating sale:", error)
    throw new Error("Failed to update sale.")
  }

  revalidatePath("/sales")
  revalidatePath(`/sales/${id}/edit`)
}

export async function deleteSale(id: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("sales").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting sale:", error)
    throw new Error("Failed to delete sale.")
  }

  revalidatePath("/sales")
}
