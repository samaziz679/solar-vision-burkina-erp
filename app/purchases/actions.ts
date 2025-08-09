"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Purchase, PurchaseItem } from "@/lib/supabase/types"

export async function createPurchase(
  formData: Omit<Purchase, "id" | "created_at" | "user_id" | "items"> & {
    items: Omit<PurchaseItem, "id" | "created_at" | "purchase_id" | "user_id">[]
  },
) {
  const supabase = createClient()

  const { items, ...purchaseData } = formData

  const { data: purchase, error: purchaseError } = await supabase
    .from("purchases")
    .insert(purchaseData)
    .select()
    .single()

  if (purchaseError) {
    console.error("Error creating purchase:", purchaseError)
    return { error: purchaseError.message }
  }

  const purchaseItemsData = items.map((item) => ({
    ...item,
    purchase_id: purchase.id,
    total_price: item.quantity * item.unit_price,
  }))

  const { error: itemsError } = await supabase.from("purchase_items").insert(purchaseItemsData)

  if (itemsError) {
    console.error("Error creating purchase items:", itemsError)
    // Optionally, roll back the purchase if items fail to insert
    await supabase.from("purchases").delete().eq("id", purchase.id)
    return { error: itemsError.message }
  }

  revalidatePath("/purchases")
  return { data: purchase }
}

export async function updatePurchase(
  id: string,
  formData: Partial<Omit<Purchase, "id" | "created_at" | "user_id" | "items">> & {
    items?: Omit<PurchaseItem, "id" | "created_at" | "purchase_id" | "user_id">[]
  },
) {
  const supabase = createClient()

  const { items, ...purchaseData } = formData

  const { data: purchase, error: purchaseError } = await supabase
    .from("purchases")
    .update(purchaseData)
    .eq("id", id)
    .select()
    .single()

  if (purchaseError) {
    console.error("Error updating purchase:", purchaseError)
    return { error: purchaseError.message }
  }

  // Handle items: delete existing and insert new ones
  if (items) {
    const { error: deleteError } = await supabase.from("purchase_items").delete().eq("purchase_id", id)
    if (deleteError) {
      console.error("Error deleting old purchase items:", deleteError)
      return { error: deleteError.message }
    }

    const purchaseItemsData = items.map((item) => ({
      ...item,
      purchase_id: purchase.id,
      total_price: item.quantity * item.unit_price,
    }))

    const { error: insertError } = await supabase.from("purchase_items").insert(purchaseItemsData)
    if (insertError) {
      console.error("Error inserting new purchase items:", insertError)
      return { error: insertError.message }
    }
  }

  revalidatePath("/purchases")
  return { data: purchase }
}

export async function deletePurchase(id: string) {
  const supabase = createClient()

  // Delete associated purchase items first
  const { error: deleteItemsError } = await supabase.from("purchase_items").delete().eq("purchase_id", id)
  if (deleteItemsError) {
    console.error("Error deleting associated purchase items:", deleteItemsError)
    return { error: deleteItemsError.message }
  }

  const { error } = await supabase.from("purchases").delete().eq("id", id)

  if (error) {
    console.error("Error deleting purchase:", error)
    return { error: error.message }
  }

  revalidatePath("/purchases")
  return { success: true }
}
