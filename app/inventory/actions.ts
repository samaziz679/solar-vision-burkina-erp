"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/supabase/types"

export async function createProduct(values: Omit<Product, "id" | "user_id" | "created_at">) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("products").insert({
    ...values,
    user_id: user.id,
  })

  if (error) {
    console.error("Error creating product:", error)
    throw new Error("Failed to create product.")
  }

  revalidatePath("/inventory")
}

export async function updateProduct(id: string, values: Omit<Product, "user_id" | "created_at">) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("products").update(values).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating product:", error)
    throw new Error("Failed to update product.")
  }

  revalidatePath("/inventory")
}

export async function deleteProduct(id: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("products").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting product:", error)
    throw new Error("Failed to delete product.")
  }

  revalidatePath("/inventory")
}
