"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Purchase } from "@/lib/supabase/types"

export async function createPurchase(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const purchase_date = formData.get("purchase_date") as string
  const product_id = formData.get("product_id") as string
  const supplier_id = formData.get("supplier_id") as string
  const quantity_purchased = Number.parseInt(formData.get("quantity_purchased") as string)
  const unit_cost = Number.parseFloat(formData.get("unit_cost") as string)
  const total_cost = Number.parseFloat(formData.get("total_cost") as string)
  const payment_status = formData.get("payment_status") as Purchase["payment_status"]
  const notes = formData.get("notes") as string

  if (
    !purchase_date ||
    !product_id ||
    !supplier_id ||
    isNaN(quantity_purchased) ||
    isNaN(unit_cost) ||
    isNaN(total_cost) ||
    !payment_status
  ) {
    return { error: "Tous les champs requis ne sont pas remplis ou sont invalides." }
  }

  const { error } = await supabase.from("purchases").insert({
    purchase_date,
    product_id,
    supplier_id,
    quantity_purchased,
    unit_cost,
    total_cost,
    payment_status,
    notes,
  })

  if (error) {
    console.error("Error creating purchase:", error)
    return { error: "Échec de l'ajout de l'achat. Veuillez réessayer." }
  }

  revalidatePath("/purchases")
  redirect("/purchases")
}

export async function updatePurchase(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const id = formData.get("id") as string
  const purchase_date = formData.get("purchase_date") as string
  const product_id = formData.get("product_id") as string
  const supplier_id = formData.get("supplier_id") as string
  const quantity_purchased = Number.parseInt(formData.get("quantity_purchased") as string)
  const unit_cost = Number.parseFloat(formData.get("unit_cost") as string)
  const total_cost = Number.parseFloat(formData.get("total_cost") as string)
  const payment_status = formData.get("payment_status") as Purchase["payment_status"]
  const notes = formData.get("notes") as string

  if (
    !id ||
    !purchase_date ||
    !product_id ||
    !supplier_id ||
    isNaN(quantity_purchased) ||
    isNaN(unit_cost) ||
    isNaN(total_cost) ||
    !payment_status
  ) {
    return { error: "Tous les champs requis ne sont pas remplis ou sont invalides." }
  }

  const { error } = await supabase
    .from("purchases")
    .update({
      purchase_date,
      product_id,
      supplier_id,
      quantity_purchased,
      unit_cost,
      total_cost,
      payment_status,
      notes,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating purchase:", error)
    return { error: "Échec de la mise à jour de l'achat. Veuillez réessayer." }
  }

  revalidatePath("/purchases")
  redirect("/purchases")
}

export async function deletePurchase(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("purchases").delete().eq("id", id)

  if (error) {
    console.error("Error deleting purchase:", error)
    return { error: "Échec de la suppression de l'achat. Veuillez réessayer." }
  }

  revalidatePath("/purchases")
  return { success: true }
}
