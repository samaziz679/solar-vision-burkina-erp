"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import type { Database } from "@/lib/supabase/types"

type SupplierInsert = Database["public"]["Tables"]["suppliers"]["Insert"]
type SupplierUpdate = Database["public"]["Tables"]["suppliers"]["Update"]

export async function createSupplier(prevState: any, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const name = formData.get("name") as string
  const phone = formData.get("phone") as string | null
  const email = formData.get("email") as string | null
  const address = formData.get("address") as string | null

  const newSupplier: SupplierInsert = {
    name,
    phone,
    email,
    address,
    created_by: user.id,
  }

  const supabase = await createServerClient()
  const { error } = await supabase.from("suppliers").insert(newSupplier)

  if (error) {
    console.error("Error creating supplier:", error.message)
    // Check for unique constraint violation (e.g., supplier name already exists)
    if (error.code === "23505") {
      // PostgreSQL unique_violation error code
      return { success: false, error: "Un fournisseur avec ce nom existe déjà." }
    }
    return { success: false, error: "Échec de la création du fournisseur: " + error.message }
  }

  revalidatePath("/suppliers")
  return { success: true, message: "Fournisseur créé avec succès!" }
}

export async function updateSupplier(prevState: any, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string | null
  const email = formData.get("email") as string | null
  const address = formData.get("address") as string | null

  const updatedSupplier: SupplierUpdate = {
    name,
    phone,
    email,
    address,
  }

  const supabase = await createServerClient()
  const { error } = await supabase.from("suppliers").update(updatedSupplier).eq("id", id)

  if (error) {
    console.error("Error updating supplier:", error.message)
    if (error.code === "23505") {
      // PostgreSQL unique_violation error code
      return { success: false, error: "Un fournisseur avec ce nom existe déjà." }
    }
    return { success: false, error: "Échec de la mise à jour du fournisseur: " + error.message }
  }

  revalidatePath("/suppliers")
  revalidatePath(`/suppliers/${id}/edit`)
  return { success: true, message: "Fournisseur mis à jour avec succès!" }
}

export async function deleteSupplier(prevState: any, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const id = formData.get("id") as string

  const supabase = await createServerClient()
  const { error } = await supabase.from("suppliers").delete().eq("id", id)

  if (error) {
    console.error("Error deleting supplier:", error.message)
    // Check for foreign key constraint violation (supplier might be linked to purchases)
    if (error.code === "23503") {
      // PostgreSQL foreign_key_violation error code
      return { success: false, error: "Impossible de supprimer ce fournisseur car il est lié à des achats existants." }
    }
    return { success: false, error: "Échec de la suppression du fournisseur: " + error.message }
  }

  revalidatePath("/suppliers")
  return { success: true, message: "Fournisseur supprimé avec succès!" }
}

