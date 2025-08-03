"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/types"

type SaleInsert = Database["public"]["Tables"]["sales"]["Insert"]
type SaleUpdate = Database["public"]["Tables"]["sales"]["Update"]

export async function addSale(prevState: any, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated." }
  }

  const product_id = formData.get("product_id") as string
  const quantity_sold = Number.parseInt(formData.get("quantity_sold") as string)
  const sale_date = formData.get("sale_date") as string
  const client_id = formData.get("client_id") as string
  const unit_price = Number.parseFloat(formData.get("unit_price") as string)

  if (!product_id || isNaN(quantity_sold) || !sale_date || !client_id || isNaN(unit_price)) {
    return { error: "Tous les champs requis doivent être remplis." }
  }

  const total_amount = quantity_sold * unit_price

  // Check if enough stock is available
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("quantity")
    .eq("id", product_id)
    .single()

  if (fetchError || !product) {
    console.error("Error fetching product for stock check:", fetchError)
    return { error: fetchError?.message || "Produit introuvable." }
  }

  if (product.quantity < quantity_sold) {
    return { error: `Stock insuffisant. Quantité disponible: ${product.quantity}` }
  }

  const { error: saleError } = await supabase.from("sales").insert({
    user_id: user.id,
    product_id,
    quantity_sold,
    sale_date,
    client_id,
    unit_price,
    total_amount,
  })

  if (saleError) {
    console.error("Error adding sale:", saleError)
    return { error: saleError.message }
  }

  // Update product quantity
  const newQuantity = product.quantity - quantity_sold
  const { error: updateError } = await supabase.from("products").update({ quantity: newQuantity }).eq("id", product_id)

  if (updateError) {
    console.error("Error updating product quantity:", updateError)
    return { error: updateError.message }
  }

  revalidatePath("/sales")
  revalidatePath("/inventory") // Revalidate inventory page as well
  redirect("/sales")
}

export async function updateSale(prevState: any, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated." }
  }

  const id = formData.get("id") as string
  const product_id = formData.get("product_id") as string
  const quantity_sold = Number.parseInt(formData.get("quantity_sold") as string)
  const sale_date = formData.get("sale_date") as string
  const client_id = formData.get("client_id") as string
  const unit_price = Number.parseFloat(formData.get("unit_price") as string)
  const old_quantity_sold = Number.parseInt(formData.get("old_quantity_sold") as string) // Get old quantity for stock adjustment

  if (!id || !product_id || isNaN(quantity_sold) || !sale_date || !client_id || isNaN(unit_price)) {
    return { error: "Tous les champs requis doivent être remplis." }
  }

  const total_amount = quantity_sold * unit_price

  // First, get the current product quantity to adjust it
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("quantity")
    .eq("id", product_id)
    .single()

  if (fetchError || !product) {
    console.error("Error fetching product for quantity adjustment:", fetchError)
    return { error: fetchError?.message || "Produit introuvable pour l'ajustement du stock." }
  }

  // Calculate the difference in quantity and adjust stock
  const quantityDifference = old_quantity_sold - quantity_sold // Note the order for sales
  const newQuantity = product.quantity + quantityDifference

  if (newQuantity < 0) {
    return { error: `Stock insuffisant après ajustement. Quantité disponible: ${product.quantity}` }
  }

  const { error: updateProductError } = await supabase
    .from("products")
    .update({ quantity: newQuantity })
    .eq("id", product_id)

  if (updateProductError) {
    console.error("Error updating product quantity:", updateProductError)
    return { error: updateProductError.message }
  }

  // Then, update the sale record
  const { error: saleError } = await supabase
    .from("sales")
    .update({
      product_id,
      quantity_sold,
      sale_date,
      client_id,
      unit_price,
      total_amount,
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (saleError) {
    console.error("Error updating sale:", saleError)
    return { error: saleError.message }
  }

  revalidatePath("/sales")
  revalidatePath("/inventory") // Revalidate inventory page as well
  redirect("/sales")
}

export async function deleteSale(id: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not authenticated." }
  }

  // Get sale details to revert stock
  const { data: sale, error: fetchSaleError } = await supabase
    .from("sales")
    .select("product_id, quantity_sold")
    .eq("id", id)
    .single()

  if (fetchSaleError || !sale) {
    console.error("Error fetching sale for deletion:", fetchSaleError)
    return { success: false, error: fetchSaleError?.message || "Vente introuvable." }
  }

  // Revert product quantity
  const { data: product, error: fetchProductError } = await supabase
    .from("products")
    .select("quantity")
    .eq("id", sale.product_id)
    .single()

  if (fetchProductError || !product) {
    console.error("Error fetching product for quantity revert:", fetchProductError)
    return { success: false, error: fetchProductError?.message || "Produit introuvable pour la mise à jour du stock." }
  }

  const newQuantity = product.quantity + sale.quantity_sold // Add back to stock
  const { error: updateProductError } = await supabase
    .from("products")
    .update({ quantity: newQuantity })
    .eq("id", sale.product_id)

  if (updateProductError) {
    console.error("Error reverting product quantity:", updateProductError)
    return { success: false, error: updateProductError.message }
  }

  // Delete the sale record
  const { error: deleteError } = await supabase.from("sales").delete().eq("id", id).eq("user_id", user.id)

  if (deleteError) {
    console.error("Error deleting sale:", deleteError)
    return { success: false, error: deleteError.message }
  }

  revalidatePath("/sales")
  revalidatePath("/inventory") // Revalidate inventory page as well
  return { success: true }
}
