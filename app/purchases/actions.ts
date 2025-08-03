"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/types"

export async function addPurchase(prevState: any, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated." }
  }

  const product_id = formData.get("product_id") as string
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const purchase_date = formData.get("purchase_date") as string
  const supplier_id = formData.get("supplier_id") as string
  const unit_price = Number.parseFloat(formData.get("unit_price") as string)

  if (!product_id || isNaN(quantity) || !purchase_date || !supplier_id || isNaN(unit_price)) {
    return { error: "Tous les champs requis doivent être remplis." }
  }

  const total_amount = quantity * unit_price

  const { error: purchaseError } = await supabase.from("purchases").insert({
    user_id: user.id,
    product_id,
    quantity,
    purchase_date,
    supplier_id,
    unit_price,
    total_amount,
  })

  if (purchaseError) {
    console.error("Error adding purchase:", purchaseError)
    return { error: purchaseError.message }
  }

  // Update product quantity
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("quantity")
    .eq("id", product_id)
    .single()

  if (fetchError || !product) {
    console.error("Error fetching product for quantity update:", fetchError)
    return { error: fetchError?.message || "Produit introuvable pour la mise à jour du stock." }
  }

  const newQuantity = product.quantity + quantity
  const { error: updateError } = await supabase.from("products").update({ quantity: newQuantity }).eq("id", product_id)

  if (updateError) {
    console.error("Error updating product quantity:", updateError)
    return { error: updateError.message }
  }

  revalidatePath("/purchases")
  revalidatePath("/inventory") // Revalidate inventory page as well
  redirect("/purchases")
}

export async function updatePurchase(prevState: any, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated." }
  }

  const id = formData.get("id") as string
  const product_id = formData.get("product_id") as string
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const purchase_date = formData.get("purchase_date") as string
  const supplier_id = formData.get("supplier_id") as string
  const unit_price = Number.parseFloat(formData.get("unit_price") as string)
  const old_quantity = Number.parseInt(formData.get("old_quantity") as string) // Get old quantity for stock adjustment

  if (!id || !product_id || isNaN(quantity) || !purchase_date || !supplier_id || isNaN(unit_price)) {
    return { error: "Tous les champs requis doivent être remplis." }
  }

  const total_amount = quantity * unit_price

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
  const quantityDifference = quantity - old_quantity
  const newQuantity = product.quantity + quantityDifference

  const { error: updateProductError } = await supabase
    .from("products")
    .update({ quantity: newQuantity })
    .eq("id", product_id)

  if (updateProductError) {
    console.error("Error updating product quantity:", updateProductError)
    return { error: updateProductError.message }
  }

  // Then, update the purchase record
  const { error: purchaseError } = await supabase
    .from("purchases")
    .update({
      product_id,
      quantity,
      purchase_date,
      supplier_id,
      unit_price,
      total_amount,
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (purchaseError) {
    console.error("Error updating purchase:", purchaseError)
    return { error: purchaseError.message }
  }

  revalidatePath("/purchases")
  revalidatePath("/inventory") // Revalidate inventory page as well
  redirect("/purchases")
}

export async function deletePurchase(id: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not authenticated." }
  }

  // Get purchase details to revert stock
  const { data: purchase, error: fetchPurchaseError } = await supabase
    .from("purchases")
    .select("product_id, quantity")
    .eq("id", id)
    .single()

  if (fetchPurchaseError || !purchase) {
    console.error("Error fetching purchase for deletion:", fetchPurchaseError)
    return { success: false, error: fetchPurchaseError?.message || "Achat introuvable." }
  }

  // Revert product quantity
  const { data: product, error: fetchProductError } = await supabase
    .from("products")
    .select("quantity")
    .eq("id", purchase.product_id)
    .single()

  if (fetchProductError || !product) {
    console.error("Error fetching product for quantity revert:", fetchProductError)
    return { success: false, error: fetchProductError?.message || "Produit introuvable pour la mise à jour du stock." }
  }

  const newQuantity = product.quantity - purchase.quantity
  const { error: updateProductError } = await supabase
    .from("products")
    .update({ quantity: newQuantity })
    .eq("id", purchase.product_id)

  if (updateProductError) {
    console.error("Error reverting product quantity:", updateProductError)
    return { success: false, error: updateProductError.message }
  }

  // Delete the purchase record
  const { error: deleteError } = await supabase.from("purchases").delete().eq("id", id).eq("user_id", user.id)

  if (deleteError) {
    console.error("Error deleting purchase:", deleteError)
    return { success: false, error: deleteError.message }
  }

  revalidatePath("/purchases")
  revalidatePath("/inventory") // Revalidate inventory page as well
  return { success: true }
}
