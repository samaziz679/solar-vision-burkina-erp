"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Product name is required."),
  price: z.coerce.number().min(0.01, "Price must be a positive number."),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  // image_url: z.string().url("Invalid URL format").optional().nullable(), // Temporarily removed for debugging
})

export async function addProduct(prevState: any, formData: FormData) {
  const supabase = createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    return { success: false, message: "Authentication required.", errors: undefined }
  }

  const validatedFields = productSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    category: formData.get("category"),
    description: formData.get("description"),
    // image_url: formData.get("image_url"), // Temporarily removed for debugging
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, price, stock, category, description } = validatedFields.data

  const { error } = await supabase.from("products").insert({
    name,
    price,
    stock,
    category,
    description,
    user_id: userData.user.id,
    // image_url, // Temporarily removed for debugging
  })

  if (error) {
    console.error("Error adding product:", error)
    return { success: false, message: "Failed to add product.", errors: undefined }
  }

  revalidatePath("/inventory")
  return { success: true, message: "Product added successfully!", errors: undefined }
}

export async function updateProduct(prevState: any, formData: FormData) {
  const supabase = createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    return { success: false, message: "Authentication required.", errors: undefined }
  }

  const validatedFields = productSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    category: formData.get("category"),
    description: formData.get("description"),
    // image_url: formData.get("image_url"), // Temporarily removed for debugging
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { id, name, price, stock, category, description } = validatedFields.data

  if (!id) {
    return { success: false, message: "Product ID is missing.", errors: undefined }
  }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      price,
      stock,
      category,
      description,
      // image_url, // Temporarily removed for debugging
    })
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) {
    console.error("Error updating product:", error)
    return { success: false, message: "Failed to update product.", errors: undefined }
  }

  revalidatePath("/inventory")
  return { success: true, message: "Product updated successfully!", errors: undefined }
}

export async function deleteProduct(id: string) {
  const supabase = createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    return { success: false, message: "Authentication required." }
  }

  const { error } = await supabase.from("products").delete().eq("id", id).eq("user_id", userData.user.id)

  if (error) {
    console.error("Error deleting product:", error)
    return { success: false, message: "Failed to delete product." }
  }

  revalidatePath("/inventory")
  return { success: true, message: "Product deleted successfully!" }
}
