"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/auth"
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/types"

export async function createProduct(formData: FormData) {
  const supabase = createClient()
  const user = await getUser()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const stock = Number.parseInt(formData.get("stock") as string)
  const imageFile = formData.get("image") as File

  if (!name || !description || !category || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) {
    return { success: false, error: "All fields are required and values must be valid." }
  }

  let imageUrl: string | null = null
  if (imageFile && imageFile.size > 0) {
    const filePath = `${user.id}/${Date.now()}-${imageFile.name}`
    const { data, error: uploadError } = await supabase.storage.from("product_images").upload(filePath, imageFile, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      console.error("Error uploading image:", uploadError.message)
      return { success: false, error: `Failed to upload image: ${uploadError.message}` }
    }
    const { data: publicUrlData } = supabase.storage.from("product_images").getPublicUrl(filePath)
    imageUrl = publicUrlData.publicUrl
  }

  const newProduct: TablesInsert<"products"> = {
    user_id: user.id,
    name,
    description,
    category,
    price,
    stock,
    image_url: imageUrl,
  }

  const { error } = await supabase.from("products").insert(newProduct)

  if (error) {
    console.error("Error creating product:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/inventory")
  return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = createClient()
  const user = await getUser()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const stock = Number.parseInt(formData.get("stock") as string)
  const imageFile = formData.get("image") as File
  const existingImageUrl = formData.get("existing_image_url") as string | null

  if (!name || !description || !category || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) {
    return { success: false, error: "All fields are required and values must be valid." }
  }

  let imageUrl: string | null = existingImageUrl
  if (imageFile && imageFile.size > 0) {
    // Delete old image if it exists and is different
    if (existingImageUrl && existingImageUrl.includes("supabase.co/storage/v1/object/public/product_images")) {
      const oldPath = existingImageUrl.split("product_images/")[1]
      await supabase.storage.from("product_images").remove([oldPath])
    }

    const filePath = `${user.id}/${Date.now()}-${imageFile.name}`
    const { data, error: uploadError } = await supabase.storage.from("product_images").upload(filePath, imageFile, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      console.error("Error uploading image:", uploadError.message)
      return { success: false, error: `Failed to upload new image: ${uploadError.message}` }
    }
    const { data: publicUrlData } = supabase.storage.from("product_images").getPublicUrl(filePath)
    imageUrl = publicUrlData.publicUrl
  } else if (formData.get("remove_image") === "true") {
    // If remove_image is checked and no new image is provided
    if (existingImageUrl && existingImageUrl.includes("supabase.co/storage/v1/object/public/product_images")) {
      const oldPath = existingImageUrl.split("product_images/")[1]
      await supabase.storage.from("product_images").remove([oldPath])
    }
    imageUrl = null
  }

  const updatedProduct: TablesUpdate<"products"> = {
    name,
    description,
    category,
    price,
    stock,
    image_url: imageUrl,
  }

  const { error } = await supabase.from("products").update(updatedProduct).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating product:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/inventory")
  revalidatePath(`/inventory/${id}/edit`)
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = createClient()
  const user = await getUser()

  // First, get the product to check for an image URL
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (fetchError) {
    console.error("Error fetching product for deletion:", fetchError.message)
    return { success: false, error: fetchError.message }
  }

  // If an image exists, delete it from storage
  if (product?.image_url && product.image_url.includes("supabase.co/storage/v1/object/public/product_images")) {
    const imagePath = product.image_url.split("product_images/")[1]
    const { error: storageError } = await supabase.storage.from("product_images").remove([imagePath])
    if (storageError) {
      console.error("Error deleting product image from storage:", storageError.message)
      // Continue with product deletion even if image deletion fails
    }
  }

  const { error } = await supabase.from("products").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting product:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/inventory")
  return { success: true }
}
