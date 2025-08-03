"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import type { Purchase } from "@/lib/supabase/types"

export async function createPurchase(prevState: any, formData: FormData) {
  const supabase = await createServerClient()

  const supplier_id = formData.get("supplier_id") as string
  const purchase_date = formData.get("purchase_date") as string
  const total_amount = Number.parseFloat(formData.get("total_amount") as string)
  const payment_status = formData.get("payment_status") as Purchase["payment_status"]
  const notes = formData.get("notes") as string

  if (!purchase_date || isNaN(total_amount) || !payment_status) {
    return { error: "Tous les champs requis ne sont pas remplis ou sont invalides." }
  }

  const { error } = await supabase.from("purchases").insert({
    supplier_id: supplier_id || null,
    purchase_date,
    total_amount,
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
  const supabase = await createServerClient()

  const id = formData.get("id") as string
  const supplier_id = formData.get("supplier_id") as string
  const purchase_date = formData.get("purchase_date") as string
  const total_amount = Number.parseFloat(formData.get("total_amount") as string)
  const payment_status = formData.get("payment_status") as Purchase["payment_status"]
  const notes = formData.get("notes") as string

  if (!id || !purchase_date || isNaN(total_amount) || !payment_status) {
    return { error: "Tous les champs requis ne sont pas remplis ou sont invalides." }
  }

  const { error } = await supabase
    .from("purchases")
    .update({
      supplier_id: supplier_id || null,
      purchase_date,
      total_amount,
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
  const supabase = await createServerClient()

  const { error } = await supabase.from("purchases").delete().eq("id", id)

  if (error) {
    console.error("Error deleting purchase:", error)
    return { error: "Échec de la suppression de l'achat. Veuillez réessayer." }
  }

  revalidatePath("/purchases")
  return { success: true }
}
