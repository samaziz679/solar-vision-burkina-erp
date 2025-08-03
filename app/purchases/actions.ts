"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { z } from "zod"

const cookieStore = cookies()
const supabase = createServerClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  cookies: {
    get(name: string) {
      return cookieStore.get(name)?.value
    },
    set(name: string, value: string, options: any) {
      cookieStore.set({ name, value, ...options })
    },
    remove(name: string, options: any) {
      cookieStore.delete({ name, ...options })
    },
  },
})

const purchaseSchema = z.object({
  id: z.string().optional(),
  product_id: z.string().min(1, "Le produit est requis."),
  supplier_id: z.string().min(1, "Le fournisseur est requis."),
  quantity: z.preprocess((val) => Number(val), z.number().int().min(1, "La quantité doit être au moins 1.")),
  unit_cost: z.preprocess((val) => Number(val), z.number().min(0.01, "Le coût unitaire doit être positif.")),
  purchase_date: z.string().min(1, "La date d'achat est requise."),
})

export async function createPurchase(
  prevState: { message: string; errors?: Record<string, string[]> },
  formData: FormData,
) {
  const validatedFields = purchaseSchema.safeParse({
    product_id: formData.get("product_id"),
    supplier_id: formData.get("supplier_id"),
    quantity: formData.get("quantity"),
    unit_cost: formData.get("unit_cost"),
    purchase_date: formData.get("purchase_date"),
  })

  if (!validatedFields.success) {
    return {
      message: "Erreurs de validation.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { product_id, supplier_id, quantity, unit_cost, purchase_date } = validatedFields.data
  const total_amount = quantity * unit_cost

  const { error } = await supabase.from("purchases").insert({
    product_id,
    supplier_id,
    quantity,
    unit_cost,
    total_amount,
    purchase_date,
  })

  if (error) {
    console.error("Error creating purchase:", error)
    return { message: "Échec de la création de l'achat." }
  }

  // Update product stock
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("stock")
    .eq("id", product_id)
    .single()

  if (productError) {
    console.error("Error fetching product stock:", productError)
    return { message: "Échec de la mise à jour du stock du produit." }
  }

  const newStock = product.stock + quantity
  const { error: updateError } = await supabase.from("products").update({ stock: newStock }).eq("id", product_id)

  if (updateError) {
    console.error("Error updating product stock:", updateError)
    return { message: "Échec de la mise à jour du stock du produit." }
  }

  revalidatePath("/purchases")
  revalidatePath("/inventory") // Revalidate inventory page as stock changed
  redirect("/purchases")
}

export async function updatePurchase(
  id: string,
  prevState: { message: string; errors?: Record<string, string[]> },
  formData: FormData,
) {
  const validatedFields = purchaseSchema.safeParse({
    product_id: formData.get("product_id"),
    supplier_id: formData.get("supplier_id"),
    quantity: formData.get("quantity"),
    unit_cost: formData.get("unit_cost"),
    purchase_date: formData.get("purchase_date"),
  })

  if (!validatedFields.success) {
    return {
      message: "Erreurs de validation.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { product_id, supplier_id, quantity, unit_cost, purchase_date } = validatedFields.data
  const total_amount = quantity * unit_cost

  // Fetch old quantity to adjust stock correctly
  const { data: oldPurchase, error: fetchError } = await supabase
    .from("purchases")
    .select("quantity, product_id")
    .eq("id", id)
    .single()

  if (fetchError) {
    console.error("Error fetching old purchase quantity:", fetchError)
    return { message: "Échec de la mise à jour de l'achat." }
  }

  const oldQuantity = oldPurchase.quantity
  const oldProductId = oldPurchase.product_id

  const { error } = await supabase
    .from("purchases")
    .update({
      product_id,
      supplier_id,
      quantity,
      unit_cost,
      total_amount,
      purchase_date,
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating purchase:", error)
    return { message: "Échec de la mise à jour de l'achat." }
  }

  // Adjust product stock based on quantity change
  if (oldProductId === product_id) {
    // Same product, just adjust stock by difference
    const stockChange = quantity - oldQuantity
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", product_id)
      .single()

    if (productError) {
      console.error("Error fetching product stock for update:", productError)
      return { message: "Échec de la mise à jour du stock du produit." }
    }

    const newStock = product.stock + stockChange
    const { error: updateError } = await supabase.from("products").update({ stock: newStock }).eq("id", product_id)

    if (updateError) {
      console.error("Error updating product stock:", updateError)
      return { message: "Échec de la mise à jour du stock du produit." }
    }
  } else {
    // Product changed, revert old product stock and add to new product stock
    // Revert old product stock
    const { data: oldProduct, error: oldProductError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", oldProductId)
      .single()

    if (oldProductError) {
      console.error("Error fetching old product stock for revert:", oldProductError)
      return { message: "Échec de la mise à jour du stock du produit." }
    }

    await supabase
      .from("products")
      .update({ stock: oldProduct.stock - oldQuantity })
      .eq("id", oldProductId)

    // Add to new product stock
    const { data: newProduct, error: newProductError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", product_id)
      .single()

    if (newProductError) {
      console.error("Error fetching new product stock for add:", newProductError)
      return { message: "Échec de la mise à jour du stock du produit." }
    }

    await supabase
      .from("products")
      .update({ stock: newProduct.stock + quantity })
      .eq("id", product_id)
  }

  revalidatePath("/purchases")
  revalidatePath("/inventory") // Revalidate inventory page as stock changed
  redirect("/purchases")
}

export async function deletePurchase(id: string) {
  // Fetch purchase details to revert stock
  const { data: purchase, error: fetchError } = await supabase
    .from("purchases")
    .select("product_id, quantity")
    .eq("id", id)
    .single()

  if (fetchError) {
    console.error("Error fetching purchase for deletion:", fetchError)
    return { message: "Échec de la suppression de l'achat." }
  }

  const { error } = await supabase.from("purchases").delete().eq("id", id)

  if (error) {
    console.error("Error deleting purchase:", error)
    return { message: "Échec de la suppression de l'achat." }
  }

  // Revert product stock
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("stock")
    .eq("id", purchase.product_id)
    .single()

  if (productError) {
    console.error("Error fetching product stock for revert:", productError)
    return { message: "Échec de la mise à jour du stock du produit." }
  }

  const newStock = product.stock - purchase.quantity
  const { error: updateError } = await supabase
    .from("products")
    .update({ stock: newStock })
    .eq("id", purchase.product_id)

  if (updateError) {
    console.error("Error updating product stock:", updateError)
    return { message: "Échec de la mise à jour du stock du produit." }
  }

  revalidatePath("/purchases")
  revalidatePath("/inventory") // Revalidate inventory page as stock changed
  return { message: "Achat supprimé avec succès." }
}
