"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import type { Database } from "@/lib/supabase/types"

type SaleInsert = Database["public"]["Tables"]["sales"]["Insert"]
type SaleUpdate = Database["public"]["Tables"]["sales"]["Update"]

export async function createSale(prevState: any, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const product_id = formData.get("product_id") as string
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const price_plan = formData.get("price_plan") as SaleInsert["price_plan"]
  const unit_price = Number.parseFloat(formData.get("unit_price") as string)
  const total = Number.parseFloat(formData.get("total") as string)
  const client_id = formData.get("client_id") as string | null
  const notes = formData.get("notes") as string | null

  const supabase = await createServerClient()

  // 1. Check product stock
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("quantity, name")
    .eq("id", product_id)
    .single()

  if (productError || !product) {
    console.error("Error fetching product for sale:", productError?.message || "Product not found")
    return { success: false, error: "Produit introuvable ou erreur de stock." }
  }

  if (product.quantity < quantity) {
    return { success: false, error: `Stock insuffisant pour ${product.name}. Disponible: ${product.quantity}` }
  }

  // 2. Create the sale entry
  const newSale: SaleInsert = {
    product_id,
    quantity,
    price_plan,
    unit_price,
    total,
    created_by: user.id,
    client_id: client_id || null,
    notes,
  }

  const { error: saleError, data: saleData } = await supabase.from("sales").insert(newSale).select("id").single()

  if (saleError || !saleData) {
    console.error("Error creating sale:", saleError?.message)
    return { success: false, error: "Échec de l'enregistrement de la vente: " + saleError?.message }
  }

  // 3. Deduct quantity from product stock
  const { error: updateError } = await supabase
    .from("products")
    .update({ quantity: product.quantity - quantity, updated_at: new Date().toISOString() })
    .eq("id", product_id)

  if (updateError) {
    console.error("Error updating product quantity after sale:", updateError.message)
    return { success: false, error: "Vente enregistrée, mais échec de la mise à jour du stock: " + updateError.message }
  }

  // 4. Log stock change (optional but good for tracking)
  const { error: logError } = await supabase.from("stock_logs").insert({
    product_id,
    action: "sale",
    quantity_before: product.quantity,
    quantity_after: product.quantity - quantity,
    price_before: unit_price,
    price_after: unit_price,
    reference_id: saleData.id,
    created_by: user.id,
    notes: `Vente de ${quantity} unités.`,
  })

  if (logError) {
    console.warn("Warning: Failed to log stock change for sale:", logError.message)
  }

  revalidatePath("/sales")
  revalidatePath("/inventory")
  return { success: true, message: "Vente enregistrée avec succès!" }
}

export async function updateSale(prevState: any, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const sale_id = formData.get("id") as string
  const product_id = formData.get("product_id") as string
  const new_quantity = Number.parseInt(formData.get("quantity") as string)
  const price_plan = formData.get("price_plan") as SaleUpdate["price_plan"]
  const unit_price = Number.parseFloat(formData.get("unit_price") as string)
  const total = Number.parseFloat(formData.get("total") as string)
  const client_id = formData.get("client_id") as string | null
  const notes = formData.get("notes") as string | null

  const supabase = await createServerClient()

  // 1. Get current sale details and product quantity before update
  const { data: currentSale, error: currentSaleError } = await supabase
    .from("sales")
    .select("quantity, product_id")
    .eq("id", sale_id)
    .single()

  if (currentSaleError || !currentSale) {
    console.error("Error fetching current sale for update:", currentSaleError?.message || "Sale not found")
    return { success: false, error: "Vente introuvable." }
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("quantity, name")
    .eq("id", product_id)
    .single()

  if (productError || !product) {
    console.error("Error fetching product for sale update:", productError?.message || "Product not found")
    return { success: false, error: "Produit introuvable ou erreur de stock." }
  }

  const old_quantity = currentSale.quantity
  const quantity_difference = new_quantity - old_quantity

  // Check if there's enough stock for the *change* in quantity
  if (quantity_difference > 0 && product.quantity < quantity_difference) {
    return {
      success: false,
      error: `Stock insuffisant pour augmenter la quantité. Disponible: ${product.quantity} pour un besoin de ${quantity_difference}.`,
    }
  }

  // 2. Update the sale entry
  const updatedSale: SaleUpdate = {
    product_id,
    quantity: new_quantity,
    price_plan,
    unit_price,
    total,
    client_id: client_id || null,
    notes,
  }

  const { error: saleUpdateError } = await supabase.from("sales").update(updatedSale).eq("id", sale_id)

  if (saleUpdateError) {
    console.error("Error updating sale:", saleUpdateError.message)
    return { success: false, error: "Échec de la mise à jour de la vente: " + saleUpdateError.message }
  }

  // 3. Adjust product quantity based on the difference
  const { error: productUpdateError } = await supabase
    .from("products")
    .update({ quantity: product.quantity - quantity_difference, updated_at: new Date().toISOString() })
    .eq("id", product_id)

  if (productUpdateError) {
    console.error("Error adjusting product quantity after sale update:", productUpdateError.message)
    return {
      success: false,
      error: "Vente mise à jour, mais échec de l'ajustement du stock: " + productUpdateError.message,
    }
  }

  // 4. Log stock change
  const { error: logError } = await supabase.from("stock_logs").insert({
    product_id,
    action: "sale_update",
    quantity_before: product.quantity + quantity_difference, // Quantity before this specific adjustment
    quantity_after: product.quantity,
    price_before: unit_price,
    price_after: unit_price,
    reference_id: sale_id,
    created_by: user.id,
    notes: `Mise à jour de la vente (quantité modifiée de ${old_quantity} à ${new_quantity}).`,
  })

  if (logError) {
    console.warn("Warning: Failed to log stock change for sale update:", logError.message)
  }

  revalidatePath("/sales")
  revalidatePath(`/sales/${sale_id}/edit`)
  revalidatePath("/inventory") // Inventory also needs revalidation
  return { success: true, message: "Vente mise à jour avec succès!" }
}

export async function deleteSale(prevState: any, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const sale_id = formData.get("id") as string

  const supabase = await createServerClient()

  // 1. Get sale details to return quantity to stock
  const { data: saleToDelete, error: fetchError } = await supabase
    .from("sales")
    .select("product_id, quantity")
    .eq("id", sale_id)
    .single()

  if (fetchError || !saleToDelete) {
    console.error("Error fetching sale to delete:", fetchError?.message || "Sale not found")
    return { success: false, error: "Vente introuvable pour suppression." }
  }

  // 2. Delete the sale entry
  const { error: deleteError } = await supabase.from("sales").delete().eq("id", sale_id)

  if (deleteError) {
    console.error("Error deleting sale:", deleteError.message)
    return { success: false, error: "Échec de la suppression de la vente: " + deleteError.message }
  }

  // 3. Return quantity to product stock
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("quantity, name")
    .eq("id", saleToDelete.product_id)
    .single()

  if (productError || !product) {
    console.error(
      "Error fetching product for stock return:",
      productError?.message || "Product not found for stock return",
    )
    // Even if product not found, we proceed as sale is already deleted.
  } else {
    const { error: updateError } = await supabase
      .from("products")
      .update({ quantity: product.quantity + saleToDelete.quantity, updated_at: new Date().toISOString() })
      .eq("id", saleToDelete.product_id)

    if (updateError) {
      console.error("Error returning quantity to product stock after sale deletion:", updateError.message)
      // This is a critical error, might need manual intervention
    } else {
      // Log stock change
      const { error: logError } = await supabase.from("stock_logs").insert({
        product_id: saleToDelete.product_id,
        action: "sale_deletion",
        quantity_before: product.quantity,
        quantity_after: product.quantity + saleToDelete.quantity,
        price_before: 0, // Price not directly relevant for deletion log
        price_after: 0,
        reference_id: sale_id,
        created_by: user.id,
        notes: `Suppression de la vente (quantité ${saleToDelete.quantity} retournée au stock).`,
      })
      if (logError) {
        console.warn("Warning: Failed to log stock change for sale deletion:", logError.message)
      }
    }
  }

  revalidatePath("/sales")
  revalidatePath("/inventory") // Inventory also needs revalidation
  return { success: true, message: "Vente supprimée avec succès!" }
}
