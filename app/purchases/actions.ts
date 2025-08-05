"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/auth"
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/types"

export async function createPurchase(formData: FormData) {
  const supabase = createClient()
  const user = await getUser()

  const product_id = formData.get("product_id") as string
  const supplier_id = formData.get("supplier_id") as string
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const unit_price = Number.parseFloat(formData.get("unit_price") as string)
  const purchase_date = formData.get("purchase_date") as string
  const notes = formData.get("notes") as string | null

  if (
    !product_id ||
    !supplier_id ||
    isNaN(quantity) ||
    quantity <= 0 ||
    isNaN(unit_price) ||
    unit_price <= 0 ||
    !purchase_date
  ) {
    return { success: false, error: "All required fields must be filled and values must be positive." }
  }

  const newPurchase: TablesInsert<"purchases"> = {
    user_id: user.id,
    product_id,
    supplier_id,
    quantity,
    unit_price,
    purchase_date,
    notes,
  }

  const { error } = await supabase.from("purchases").insert(newPurchase)

  if (error) {
    console.error("Error creating purchase:", error.message)
    return { success: false, error: error.message }
  }

  // Update product stock
  const { data: product, error: productFetchError } = await supabase
    .from("products")
    .select("stock")
    .eq("id", product_id)
    .single()

  if (productFetchError || !product) {
    console.error("Error fetching product for stock update:", productFetchError?.message || "Product not found")
    // Still return success for purchase creation, but log stock error
  } else {
    const newStock = product.stock + quantity
    const { error: stockUpdateError } = await supabase.from("products").update({ stock: newStock }).eq("id", product_id)

    if (stockUpdateError) {
      console.error("Error updating product stock:", stockUpdateError.message)
    }
  }

  revalidatePath("/purchases")
  revalidatePath("/inventory") // Revalidate inventory page as stock changed
  return { success: true }
}

export async function updatePurchase(id: string, formData: FormData) {
  const supabase = createClient()
  const user = await getUser()

  const product_id = formData.get("product_id") as string
  const supplier_id = formData.get("supplier_id") as string
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const unit_price = Number.parseFloat(formData.get("unit_price") as string)
  const purchase_date = formData.get("purchase_date") as string
  const notes = formData.get("notes") as string | null
  const original_quantity = Number.parseInt(formData.get("original_quantity") as string) // Hidden field for original quantity

  if (
    !product_id ||
    !supplier_id ||
    isNaN(quantity) ||
    quantity <= 0 ||
    isNaN(unit_price) ||
    unit_price <= 0 ||
    !purchase_date
  ) {
    return { success: false, error: "All required fields must be filled and values must be positive." }
  }

  const updatedPurchase: TablesUpdate<"purchases"> = {
    product_id,
    supplier_id,
    quantity,
    unit_price,
    purchase_date,
    notes,
  }

  const { error } = await supabase.from("purchases").update(updatedPurchase).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating purchase:", error.message)
    return { success: false, error: error.message }
  }

  // Update product stock based on quantity change
  const quantityDifference = quantity - original_quantity
  if (quantityDifference !== 0) {
    const { data: product, error: productFetchError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", product_id)
      .single()

    if (productFetchError || !product) {
      console.error("Error fetching product for stock update:", productFetchError?.message || "Product not found")
    } else {
      const newStock = product.stock + quantityDifference
      const { error: stockUpdateError } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", product_id)

      if (stockUpdateError) {
        console.error("Error updating product stock:", stockUpdateError.message)
      }
    }
  }

  revalidatePath("/purchases")
  revalidatePath(`/purchases/${id}/edit`)
  revalidatePath("/inventory") // Revalidate inventory page as stock changed
  return { success: true }
}

export async function deletePurchase(id: string) {
  const supabase = createClient()
  const user = await getUser()

  // Get the purchase details to revert stock
  const { data: purchase, error: fetchError } = await supabase
    .from("purchases")
    .select("product_id, quantity")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !purchase) {
    console.error("Error fetching purchase for deletion:", fetchError?.message || "Purchase not found")
    return { success: false, error: fetchError?.message || "Purchase not found." }
  }

  const { error } = await supabase.from("purchases").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting purchase:", error.message)
    return { success: false, error: error.message }
  }

  // Revert product stock
  const { data: product, error: productFetchError } = await supabase
    .from("products")
    .select("stock")
    .eq("id", purchase.product_id)
    .single()

  if (productFetchError || !product) {
    console.error("Error fetching product for stock reversion:", productFetchError?.message || "Product not found")
  } else {
    const newStock = product.stock - purchase.quantity
    const { error: stockUpdateError } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", purchase.product_id)

    if (stockUpdateError) {
      console.error("Error reverting product stock:", stockUpdateError.message)
    }
  }

  revalidatePath("/purchases")
  revalidatePath("/inventory") // Revalidate inventory page as stock changed
  return { success: true }
}
