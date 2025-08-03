"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import type { Database } from "@/lib/supabase/types"

type PurchaseInsert = Database["public"]["Tables"]["purchases"]["Insert"]
type PurchaseUpdate = Database["public"]["Tables"]["purchases"]["Update"]

export async function createPurchase(prevState: any, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const product_id = formData.get("product_id") as string
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const unit_price = Number.parseFloat(formData.get("unit_price") as string)
  const total = Number.parseFloat(formData.get("total") as string)
  const supplier_id = formData.get("supplier_id") as string | null
  const notes = formData.get("notes") as string | null

  const supabase = await createServerClient()

  // 1. Create the purchase entry
  const newPurchase: PurchaseInsert = {
    product_id,
    quantity,
    unit_price,
    total,
    created_by: user.id,
    supplier_id: supplier_id || null,
    notes,
  }

  const { error: purchaseError, data: purchaseData } = await supabase
    .from("purchases")
    .insert(newPurchase)
    .select("id")
    .single()

  if (purchaseError || !purchaseData) {
    console.error("Error creating purchase:", purchaseError?.message)
    return { success: false, error: "Échec de l'enregistrement de l'achat: " + purchaseError?.message }
  }

  // 2. Get current product quantity
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("quantity, name")
    .eq("id", product_id)
    .single()

  if (productError || !product) {
    console.error("Error fetching product for purchase stock update:", productError?.message || "Product not found")
    return { success: false, error: "Produit introuvable pour la mise à jour du stock." }
  }

  // 3. Add quantity to product stock
  const { error: updateError } = await supabase
    .from("products")
    .update({ quantity: product.quantity + quantity, updated_at: new Date().toISOString() })
    .eq("id", product_id)

  if (updateError) {
    console.error("Error updating product quantity after purchase:", updateError.message)
    return { success: false, error: "Achat enregistré, mais échec de la mise à jour du stock: " + updateError.message }
  }

  // 4. Log stock change
  const { error: logError } = await supabase.from("stock_logs").insert({
    product_id,
    action: "purchase",
    quantity_before: product.quantity,
    quantity_after: product.quantity + quantity,
    price_before: unit_price,
    price_after: unit_price,
    reference_id: purchaseData.id,
    created_by: user.id,
    notes: `Achat de ${quantity} unités.`,
  })

  if (logError) {
    console.warn("Warning: Failed to log stock change for purchase:", logError.message)
  }

  revalidatePath("/purchases")
  revalidatePath("/inventory") // Inventory also needs revalidation
  return { success: true, message: "Achat enregistré avec succès!" }
}

export async function updatePurchase(prevState: any, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const purchase_id = formData.get("id") as string
  const product_id = formData.get("product_id") as string
  const new_quantity = Number.parseInt(formData.get("quantity") as string)
  const unit_price = Number.parseFloat(formData.get("unit_price") as string)
  const total = Number.parseFloat(formData.get("total") as string)
  const supplier_id = formData.get("supplier_id") as string | null
  const notes = formData.get("notes") as string | null

  const supabase = await createServerClient()

  // 1. Get current purchase details and product quantity before update
  const { data: currentPurchase, error: currentPurchaseError } = await supabase
    .from("purchases")
    .select("quantity, product_id")
    .eq("id", purchase_id)
    .single()

  if (currentPurchaseError || !currentPurchase) {
    console.error("Error fetching current purchase for update:", currentPurchaseError?.message || "Purchase not found")
    return { success: false, error: "Achat introuvable." }
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("quantity, name")
    .eq("id", product_id)
    .single()

  if (productError || !product) {
    console.error("Error fetching product for purchase update:", productError?.message || "Product not found")
    return { success: false, error: "Produit introuvable ou erreur de stock." }
  }

  const old_quantity = currentPurchase.quantity
  const quantity_difference = new_quantity - old_quantity // Positive if quantity increased, negative if decreased

  // 2. Update the purchase entry
  const updatedPurchase: PurchaseUpdate = {
    product_id,
    quantity: new_quantity,
    unit_price,
    total,
    supplier_id: supplier_id || null,
    notes,
  }

  const { error: purchaseUpdateError } = await supabase.from("purchases").update(updatedPurchase).eq("id", purchase_id)

  if (purchaseUpdateError) {
    console.error("Error updating purchase:", purchaseUpdateError.message)
    return { success: false, error: "Échec de la mise à jour de l'achat: " + purchaseUpdateError.message }
  }

  // 3. Adjust product quantity based on the difference
  const { error: productUpdateError } = await supabase
    .from("products")
    .update({ quantity: product.quantity + quantity_difference, updated_at: new Date().toISOString() })
    .eq("id", product_id)

  if (productUpdateError) {
    console.error("Error adjusting product quantity after purchase update:", productUpdateError.message)
    return {
      success: false,
      error: "Achat mis à jour, mais échec de l'ajustement du stock: " + productUpdateError.message,
    }
  }

  // 4. Log stock change
  const { error: logError } = await supabase.from("stock_logs").insert({
    product_id,
    action: "purchase_update",
    quantity_before: product.quantity - quantity_difference, // Quantity before this specific adjustment
    quantity_after: product.quantity,
    price_before: unit_price,
    price_after: unit_price,
    reference_id: purchase_id,
    created_by: user.id,
    notes: `Mise à jour de l'achat (quantité modifiée de ${old_quantity} à ${new_quantity}).`,
  })

  if (logError) {
    console.warn("Warning: Failed to log stock change for purchase update:", logError.message)
  }

  revalidatePath("/purchases")
  revalidatePath(`/purchases/${purchase_id}/edit`)
  revalidatePath("/inventory") // Inventory also needs revalidation
  return { success: true, message: "Achat mis à jour avec succès!" }
}

export async function deletePurchase(prevState: any, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const purchase_id = formData.get("id") as string

  const supabase = await createServerClient()

  // 1. Get purchase details to deduct quantity from stock
  const { data: purchaseToDelete, error: fetchError } = await supabase
    .from("purchases")
    .select("product_id, quantity")
    .eq("id", purchase_id)
    .single()

  if (fetchError || !purchaseToDelete) {
    console.error("Error fetching purchase to delete:", fetchError?.message || "Purchase not found")
    return { success: false, error: "Achat introuvable pour suppression." }
  }

  // 2. Delete the purchase entry
  const { error: deleteError } = await supabase.from("purchases").delete().eq("id", purchase_id)

  if (deleteError) {
    console.error("Error deleting purchase:", deleteError.message)
    return { success: false, error: "Échec de la suppression de l'achat: " + deleteError.message }
  }

  // 3. Deduct quantity from product stock
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("quantity, name")
    .eq("id", purchaseToDelete.product_id)
    .single()

  if (productError || !product) {
    console.error(
      "Error fetching product for stock deduction after purchase deletion:",
      productError?.message || "Product not found for stock deduction",
    )
    // Even if product not found, we proceed as purchase is already deleted.
  } else {
    // Ensure we don't go below zero quantity
    const newQuantity = Math.max(0, product.quantity - purchaseToDelete.quantity)
    const { error: updateError } = await supabase
      .from("products")
      .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
      .eq("id", purchaseToDelete.product_id)

    if (updateError) {
      console.error("Error deducting quantity from product stock after purchase deletion:", updateError.message)
      // This is a critical error, might need manual intervention
    } else {
      // Log stock change
      const { error: logError } = await supabase.from("stock_logs").insert({
        product_id: purchaseToDelete.product_id,
        action: "purchase_deletion",
        quantity_before: product.quantity,
        quantity_after: newQuantity,
        price_before: 0, // Price not directly relevant for deletion log
        price_after: 0,
        reference_id: purchase_id,
        created_by: user.id,
        notes: `Suppression de l'achat (quantité ${purchaseToDelete.quantity} déduite du stock).`,
      })
      if (logError) {
        console.warn("Warning: Failed to log stock change for purchase deletion:", logError.message)
      }
    }
  }

  revalidatePath("/purchases")
  revalidatePath("/inventory") // Inventory also needs revalidation
  return { success: true, message: "Achat supprimé avec succès!" }
}
