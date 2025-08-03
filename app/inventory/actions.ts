"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/types"

export async function createProduct(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const newProduct: TablesInsert<"products"> = {
    user_id: user.id,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    cost_price: Number.parseFloat(formData.get("cost_price") as string),
    selling_price: Number.parseFloat(formData.get("selling_price") as string),
    quantity_in_stock: Number.parseInt(formData.get("quantity_in_stock") as string),
    image_url: formData.get("image_url") as string,
  }

  const { error } = await supabase.from("products").insert(newProduct)

  if (error) {
    console.error("Error creating product:", error)
    return { error: error.message }
  }

  revalidatePath("/inventory")
  return { success: true }
}

export async function updateProduct(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const id = formData.get("id") as string
  const updatedProduct: TablesUpdate<"products"> = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    cost_price: Number.parseFloat(formData.get("cost_price") as string),
    selling_price: Number.parseFloat(formData.get("selling_price") as string),
    quantity_in_stock: Number.parseInt(formData.get("quantity_in_stock") as string),
    image_url: formData.get("image_url") as string,
  }

  const { error } = await supabase.from("products").update(updatedProduct).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating product:", error)
    return { error: error.message }
  }

  revalidatePath("/inventory")
  return { success: true }
}

export async function deleteProduct(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const id = formData.get("id") as string

  const { error } = await supabase.from("products").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting product:", error)
    return { error: error.message }
  }

  revalidatePath("/inventory")
  return { success: true }
}
