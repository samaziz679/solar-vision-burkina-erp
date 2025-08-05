"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/lib/auth"
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/types"

export async function createSale(formData: FormData) {
  const supabase = createClient()
  const user = await getUser()

  const product_id = formData.get("product_id") as string
  const client_id = formData.get("client_id") as string
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const unit_price = Number.parseFloat(formData.get("unit_price") as string)
  const sale_date = formData.get("sale_date") as string
  const notes = formData.get("notes") as string | null

  if (
    !product_id ||
    !client_id ||
    isNaN(quantity) ||
    quantity <= 0 ||
    isNaN(unit_price) ||
    unit_price <= 0 ||
    !sale_date
  ) {
    return { success: false, error: "All required fields must be filled and values must be positive." }
  }

  // Check if enough stock is available
  const { data: product, error: productFetchError } = await supabase
    .from("products")
    .select("stock")
    .eq("id", product_id)
    .single()

  if (productFetchError || !product) {
    console.error("Error fetching product for stock check:", productFetchError?.message || "Product not found")
    return { success: false, error: "Product not found or error fetching product details." }
  }

  if (product.stock < quantity) {
    return { success: false, error: `Not enough stock for ${product.stock} units. Available: ${product.stock}` }
  }

  const newSale: TablesInsert<"sales"> = {
    user_id: user.id,
    product_id,
    client_id,
    quantity,
    unit_price,
    sale_date,
    notes,
  }

  const { error } = await supabase.from("sales").insert(newSale)

  if (error) {
    console.error("Error creating sale:", error.message)
    return { success: false, error: error.message }
  }

  // Update product stock
  const newStock = product.stock - quantity
  const { error: stockUpdateError } = await supabase.from("products").update({ stock: newStock }).eq("id", product_id)

  if (stockUpdateError) {
    console.error("Error updating product stock:", stockUpdateError.message)
    // Even if stock update fails, the sale is recorded. Consider rollback or alert.
  }

  revalidatePath("/sales")
  revalidatePath("/inventory") // Revalidate inventory page as stock changed
  return { success: true }
}

export async function updateSale(id: string, formData: FormData) {
  const supabase = createClient()
  const user = await getUser()

  const product_id = formData.get("product_id") as string
  const client_id = formData.get("client_id") as string
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const unit_price = Number.parseFloat(formData.get("unit_price") as string)
  const sale_date = formData.get("sale_date") as string
  const notes = formData.get("notes") as string | null
  const original_quantity = Number.parseInt(formData.get("original_quantity") as string) // Hidden field for original quantity

  if (
    !product_id ||
    !client_id ||
    isNaN(quantity) ||
    quantity <= 0 ||
    isNaN(unit_price) ||
    unit_price <= 0 ||
    !sale_date
  ) {
    return { success: false, error: "All required fields must be filled and values must be positive." }
  }

  // Calculate quantity difference for stock adjustment
  const quantityDifference = quantity - original_quantity

  // Check if enough stock is available for the *net* change
  if (quantityDifference !== 0) {
    const { data: product, error: productFetchError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", product_id)
      .single()

    if (productFetchError || !product) {
      console.error("Error fetching product for stock check:", productFetchError?.message || "Product not found")
      return { success: false, error: "Product not found or error fetching product details." }
    }

    // If increasing quantity, check if enough stock
    if (quantityDifference > 0 && product.stock < quantityDifference) {
      return {
        success: false,
        error: `Not enough stock to increase sale quantity by ${quantityDifference}. Available: ${product.stock}`,
      }
    }
  }

  const updatedSale: TablesUpdate<"sales"> = {
    product_id,
    client_id,
    quantity,
    unit_price,
    sale_date,
    notes,
  }

  const { error } = await supabase.from("sales").update(updatedSale).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating sale:", error.message)
    return { success: false, error: error.message }
  }

  // Update product stock based on quantity change
  if (quantityDifference !== 0) {
    const { data: product, error: productFetchError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", product_id)
      .single()

    if (productFetchError || !product) {
      console.error(
        "Error fetching product for stock update (after sale update):",
        productFetchError?.message || "Product not found",
      )
    } else {
      const newStock = product.stock - quantityDifference
      const { error: stockUpdateError } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", product_id)

      if (stockUpdateError) {
        console.error("Error updating product stock (after sale update):", stockUpdateError.message)
      }
    }
  }

  revalidatePath("/sales")
  revalidatePath(`/sales/${id}/edit`)
  revalidatePath("/inventory") // Revalidate inventory page as stock changed
  return { success: true }
}

export async function deleteSale(id: string) {
  const supabase = createClient()
  const user = await getUser()

  // Get the sale details to revert stock
  const { data: sale, error: fetchError } = await supabase
    .from("sales")
    .select("product_id, quantity")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (fetchError || !sale) {
    console.error("Error fetching sale for deletion:", fetchError?.message || "Sale not found")
    return { success: false, error: fetchError?.message || "Sale not found." }
  }

  const { error } = await supabase.from("sales").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting sale:", error.message)
    return { success: false, error: error.message }
  }

  // Revert product stock
  const { data: product, error: productFetchError } = await supabase
    .from("products")
    .select("stock")
    .eq("id", sale.product_id)
    .single()

  if (productFetchError || !product) {
    console.error("Error fetching product for stock reversion:", productFetchError?.message || "Product not found")
  } else {
    const newStock = product.stock + sale.quantity
    const { error: stockUpdateError } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", sale.product_id)

    if (stockUpdateError) {
      console.error("Error reverting product stock:", stockUpdateError.message)
    }
  }

  revalidatePath("/sales")
  revalidatePath("/inventory") // Revalidate inventory page as stock changed
  return { success: true }
}
