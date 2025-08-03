"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import type { Sale } from "@/lib/supabase/types"

export async function createSale(prevState: any, formData: FormData) {
  const supabase = await createServerClient()

  const client_id = formData.get("client_id") as string
  const sale_date = formData.get("sale_date") as string
  const total_amount = Number.parseFloat(formData.get("total_amount") as string)
  const payment_status = formData.get("payment_status") as Sale["payment_status"]
  const notes = formData.get("notes") as string

  if (!sale_date || isNaN(total_amount) || !payment_status) {
    return { error: "Tous les champs requis ne sont pas remplis ou sont invalides." }
  }

  const { error } = await supabase.from("sales").insert({
    client_id: client_id || null,
    sale_date,
    total_amount,
    payment_status,
    notes,
  })

  if (error) {
    console.error("Error creating sale:", error)
    return { error: "Échec de l'ajout de la vente. Veuillez réessayer." }
  }

  revalidatePath("/sales")
  redirect("/sales")
}

export async function updateSale(prevState: any, formData: FormData) {
  const supabase = await createServerClient()

  const id = formData.get("id") as string
  const client_id = formData.get("client_id") as string
  const sale_date = formData.get("sale_date") as string
  const total_amount = Number.parseFloat(formData.get("total_amount") as string)
  const payment_status = formData.get("payment_status") as Sale["payment_status"]
  const notes = formData.get("notes") as string

  if (!id || !sale_date || isNaN(total_amount) || !payment_status) {
    return { error: "Tous les champs requis ne sont pas remplis ou sont invalides." }
  }

  const { error } = await supabase
    .from("sales")
    .update({
      client_id: client_id || null,
      sale_date,
      total_amount,
      payment_status,
      notes,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating sale:", error)
    return { error: "Échec de la mise à jour de la vente. Veuillez réessayer." }
  }

  revalidatePath("/sales")
  redirect("/sales")
}

export async function deleteSale(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("sales").delete().eq("id", id)

  if (error) {
    console.error("Error deleting sale:", error)
    return { error: "Échec de la suppression de la vente. Veuillez réessayer." }
  }

  revalidatePath("/sales")
  return { success: true }
}
