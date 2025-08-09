"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Product } from "@/lib/supabase/types"

export async function createProduct(formData: Omit<Product, "id" | "created_at" | "user_id">) {
  const supabase = createClient()
  const { data, error } = await supabase.from("products").insert(formData).select().single()

  if (error) {
    console.error("Error creating product:", error)
    return { error: error.message }
  }

  revalidatePath("/inventory")
  return { data }
}

export async function updateProduct(id: string, formData: Partial<Omit<Product, "id" | "created_at" | "user_id">>) {
  const supabase = createClient()
  const { data, error } = await supabase.from("products").update(formData).eq("id", id).select().single()

  if (error) {
    console.error("Error updating product:", error)
    return { error: error.message }
  }

  revalidatePath("/inventory")
  return { data }
}

export async function deleteProduct(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("Error deleting product:", error)
    return { error: error.message }
  }

  revalidatePath("/inventory")
  return { success: true }
}
