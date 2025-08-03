"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/supabase/types"

export async function createProduct(prevState: any, formData: FormData) {
  const supabase = await createServerClient()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const unit = formData.get("unit") as string
  const prix_achat = Number.parseFloat(formData.get("prix_achat") as string)
  const prix_vente_detail_1 = Number.parseFloat(formData.get("prix_vente_detail_1") as string)
  const prix_vente_detail_2 = Number.parseFloat(formData.get("prix_vente_detail_2") as string)
  const prix_vente_gros = Number.parseFloat(formData.get("prix_vente_gros") as string)
  const type = formData.get("type") as Product["type"]
  const image = formData.get("image") as string

  if (
    !name ||
    isNaN(quantity) ||
    !unit ||
    isNaN(prix_achat) ||
    isNaN(prix_vente_detail_1) ||
    isNaN(prix_vente_detail_2) ||
    isNaN(prix_vente_gros) ||
    !type
  ) {
    return { error: "Tous les champs requis ne sont pas remplis ou sont invalides." }
  }

  const { error } = await supabase.from("products").insert({
    name,
    description,
    quantity,
    unit,
    prix_achat,
    prix_vente_detail_1,
    prix_vente_detail_2,
    prix_vente_gros,
    type,
    image,
  })

  if (error) {
    console.error("Error creating product:", error)
    return { error: "Échec de l'ajout du produit. Veuillez réessayer." }
  }

  revalidatePath("/inventory")
  redirect("/inventory")
}

export async function updateProduct(prevState: any, formData: FormData) {
  const supabase = await createServerClient()

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const unit = formData.get("unit") as string
  const prix_achat = Number.parseFloat(formData.get("prix_achat") as string)
  const prix_vente_detail_1 = Number.parseFloat(formData.get("prix_vente_detail_1") as string)
  const prix_vente_detail_2 = Number.parseFloat(formData.get("prix_vente_detail_2") as string)
  const prix_vente_gros = Number.parseFloat(formData.get("prix_vente_gros") as string)
  const type = formData.get("type") as Product["type"]
  const image = formData.get("image") as string

  if (
    !id ||
    !name ||
    isNaN(quantity) ||
    !unit ||
    isNaN(prix_achat) ||
    isNaN(prix_vente_detail_1) ||
    isNaN(prix_vente_detail_2) ||
    isNaN(prix_vente_gros) ||
    !type
  ) {
    return { error: "Tous les champs requis ne sont pas remplis ou sont invalides." }
  }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      description,
      quantity,
      unit,
      prix_achat,
      prix_vente_detail_1,
      prix_vente_detail_2,
      prix_vente_gros,
      type,
      image,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating product:", error)
    return { error: "Échec de la mise à jour du produit. Veuillez réessayer." }
  }

  revalidatePath("/inventory")
  redirect("/inventory")
}

export async function deleteProduct(id: string) {
  const supabase = await createServerClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("Error deleting product:", error)
    return { error: "Échec de la suppression du produit. Veuillez réessayer." }
  }

  revalidatePath("/inventory")
  return { success: true }
}
