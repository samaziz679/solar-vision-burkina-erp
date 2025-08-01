"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import type { Database } from "@/lib/supabase/types"

type SaleInsert = Database["public"]["Tables"]["sales"]["Insert"]

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
  const client_id = formData.get("client_id") as string | null // Will be used later
  const notes = formData.get("notes") as string | null

  const supabase = await createServerClient()

  // 1. Check product stock
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("quantity")
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
    client_id: client_id || null, // Assign client_id or null
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
    // Optionally, you might want to roll back the sale here if the stock update fails
    return { success: false, error: "Vente enregistrée, mais échec de la mise à jour du stock: " + updateError.message }
  }

  // 4. Log stock change (optional but good for tracking)
  const { error: logError } = await supabase.from("stock_logs").insert({
    product_id,
    action: "sale",
    quantity_before: product.quantity,
    quantity_after: product.quantity - quantity,
    price_before: unit_price, // Using unit_price of the sale as price_before for log
    price_after: unit_price,
    reference_id: saleData.id,
    created_by: user.id,
    notes: `Vente de ${quantity} unités.`,
  })

  if (logError) {
    console.warn("Warning: Failed to log stock change for sale:", logError.message)
  }

  revalidatePath("/sales") // Revalidate sales list
  revalidatePath("/inventory") // Revalidate inventory list as stock changed
  return { success: true, message: "Vente enregistrée avec succès!" }
}

