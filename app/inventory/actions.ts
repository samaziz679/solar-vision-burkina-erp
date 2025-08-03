"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/types"

export async function addProduct(prevState: any, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated." }
  }

  const name = formData.get("name") as string
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const unit = formData.get("unit") as string
  const type = formData.get("type") as string
  const prix_achat = Number.parseFloat(formData.get("prix_achat") as string)
  const prix_vente_detail_1 = Number.parseFloat(formData.get("prix_vente_detail_1") as string)
  const prix_vente_detail_2 = Number.parseFloat(formData.get("prix_vente_detail_2") as string)
  const prix_vente_gros = Number.parseFloat(formData.get("prix_vente_gros") as string)
  const description = formData.get("description") as string
  const image = formData.get("image") as string

  if (!name || isNaN(quantity) || isNaN(prix_achat) || isNaN(prix_vente_detail_1)) {
    return { error: "Le nom, la quantité, le prix d'achat et le prix de vente (Détail 1) sont requis." }
  }

  const { error } = await supabase.from("products").insert({
    user_id: user.id,
    name,
    quantity,
    unit,
    type,
    prix_achat,
    prix_vente_detail_1,
    prix_vente_detail_2: isNaN(prix_vente_detail_2) ? null : prix_vente_detail_2,
    prix_vente_gros: isNaN(prix_vente_gros) ? null : prix_vente_gros,
    description,
    image,
  })

  if (error) {
    console.error("Error adding product:", error)
    return { error: error.message }
  }

  revalidatePath("/inventory")
  redirect("/inventory")
}

export async function updateProduct(prevState: any, formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated." }
  }

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const unit = formData.get("unit") as string
  const type = formData.get("type") as string
  const prix_achat = Number.parseFloat(formData.get("prix_achat") as string)
  const prix_vente_detail_1 = Number.parseFloat(formData.get("prix_vente_detail_1") as string)
  const prix_vente_detail_2 = Number.parseFloat(formData.get("prix_vente_detail_2") as string)
  const prix_vente_gros = Number.parseFloat(formData.get("prix_vente_gros") as string)
  const description = formData.get("description") as string
  const image = formData.get("image") as string

  if (!id || !name || isNaN(quantity) || isNaN(prix_achat) || isNaN(prix_vente_detail_1)) {
    return { error: "Le nom, la quantité, le prix d'achat et le prix de vente (Détail 1) sont requis." }
  }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      quantity,
      unit,
      type,
      prix_achat,
      prix_vente_detail_1,
      prix_vente_detail_2: isNaN(prix_vente_detail_2) ? null : prix_vente_detail_2,
      prix_vente_gros: isNaN(prix_vente_gros) ? null : prix_vente_gros,
      description,
      image,
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating product:", error)
    return { error: error.message }
  }

  revalidatePath("/inventory")
  redirect("/inventory")
}

export async function deleteProduct(id: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "User not authenticated." }
  }

  const { error } = await supabase.from("products").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting product:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/inventory")
  return { success: true }
}
