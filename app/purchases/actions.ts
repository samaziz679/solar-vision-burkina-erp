"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Purchase } from "@/lib/supabase/types"

export async function createPurchase(formData: Omit<Purchase, "id" | "user_id" | "created_at">) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("purchases").insert({
    ...formData,
    user_id: user.id,
  })

  if (error) {
    console.error("Error creating purchase:", error)
    throw new Error("Failed to create purchase.")
  }

  revalidatePath("/purchases")
}

export async function updatePurchase(id: string, formData: Omit<Purchase, "id" | "user_id" | "created_at">) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("purchases").update(formData).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating purchase:", error)
    throw new Error("Failed to update purchase.")
  }

  revalidatePath("/purchases")
}

export async function deletePurchase(id: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("purchases").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting purchase:", error)
    throw new Error("Failed to delete purchase.")
  }

  revalidatePath("/purchases")
}
