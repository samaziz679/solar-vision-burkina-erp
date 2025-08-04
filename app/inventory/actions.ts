"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Product } from "@/lib/supabase/types"

export async function createProduct(formData: Omit<Product, "id" | "user_id" | "created_at">) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("products").insert({ ...formData, user_id: user.id })

  if (error) {
    console.error("Error creating product:", error)
    throw new Error("Failed to create product.")
  }

  revalidatePath("/inventory")
}

export async function updateProduct(id: string, formData: Omit<Product, "id" | "user_id" | "created_at">) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("products").update(formData).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating product:", error)
    throw new Error("Failed to update product.")
  }

  revalidatePath("/inventory")
  revalidatePath(`/inventory/${id}/edit`)
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
