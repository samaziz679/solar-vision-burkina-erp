"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Purchase } from "@/lib/supabase/types"

export async function createPurchase(values: Omit<Purchase, "id" | "user_id" | "created_at" | "total_amount">) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("purchases").insert({
    ...values,
    user_id: user.id,
    total_amount: values.quantity * values.unit_price,
  })

  if (error) {
    console.error("Error creating purchase:", error)
    throw new Error("Failed to create purchase.")
  }

  revalidatePath("/purchases")
}

export async function updatePurchase(id: string, values: Omit<Purchase, "user_id" | "created_at" | "total_amount">) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase
    .from("purchases")
    .update({
      ...values,
      total_amount: values.quantity * values.unit_price,
    })
    .eq("id", id)
    .eq("user_id", user.id)

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
