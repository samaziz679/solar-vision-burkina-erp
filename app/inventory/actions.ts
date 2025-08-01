"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import type { Database } from "@/lib/supabase/types"

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]

export async function createProduct(prevState: any, formData: FormData) {
  // prevState added for useFormState
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const name = formData.get("name") as string
  const type = formData.get("type") as string
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const prix_achat = Number.parseFloat(formData.get("prix_achat") as string)
  const prix_vente_detail_1 = Number.parseFloat(formData.get("prix_vente_detail_1") as string)
  const prix_vente_detail_2 = Number.parseFloat(formData.get("prix_vente_detail_2") as string)
  const prix_vente_gros = Number.parseFloat(formData.get("prix_vente_gros") as string)
  const seuil_stock_bas = Number.parseInt(formData.get("seuil_stock_bas") as string)

  const newProduct: ProductInsert = {
    name,
    type,
    quantity,
    prix_achat,
    prix_vente_detail_1,
    prix_vente_detail_2,
    prix_vente_gros,
    seuil_stock_bas,
    created_by: user.id,
  }

  const supabase = await createServerClient()
  const { error } = await supabase.from("products").insert(newProduct)

  if (error) {
    console.error("Error creating product:", error.message)
    return { error: "Failed to create product: " + error.message } // Return error for useFormState
  }

  revalidatePath("/inventory") // Revalidate the inventory page to show the new product
  redirect("/inventory") // Redirect back to the inventory list
}
