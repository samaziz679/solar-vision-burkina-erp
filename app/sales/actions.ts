"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { cookies } from "next/headers"

const cookieStore = cookies()
const supabase = createClient()

const saleSchema = z.object({
  id: z.string().optional(),
  product_id: z.string().min(1, "Le produit est requis."),
  client_id: z.string().min(1, "Le client est requis."),
  quantity: z.preprocess((val) => Number(val), z.number().int().min(1, "La quantité doit être au moins 1.")),
  unit_price: z.preprocess((val) => Number(val), z.number().min(0.01, "Le prix unitaire doit être positif.")),
  sale_date: z.string().min(1, "La date de vente est requise."),
})

export async function createSale(
  prevState: { message: string; errors?: Record<string, string[]> },
  formData: FormData,
) {
  const validatedFields = saleSchema.safeParse({
    product_id: formData.get("product_id"),
    client_id: formData.get("client_id"),
    quantity: formData.get("quantity"),
    unit_price: formData.get("unit_price"),
    sale_date: formData.get("sale_date"),
  })

  if (!validatedFields.success) {
    return {
      message: "Erreurs de validation.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { product_id, client_id, quantity, unit_price, sale_date } = validatedFields.data
  const total_amount = quantity * unit_price

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("sales").insert({
    product_id,
    client_id,
    quantity,
    unit_price,
    total_amount,
    sale_date,
    user_id: user.id,
  })

  if (error) {
    console.error("Error creating sale:", error)
    return { message: "Échec de la création de la vente." }
  }

  // Decrease product stock
  const { data: product, error: productFetchError } = await supabase
    .from("products")
    .select("stock")
    .eq("id", product_id)
    .single()

  if (productFetchError || !product) {
    console.error("Error fetching product stock:", productFetchError)
    return { message: "Produit introuvable ou erreur de stock." }
  }

  if (product.stock < quantity) {
    return { message: "Stock insuffisant pour cette vente." }
  }

  revalidatePath("/sales")
  revalidatePath("/inventory") // Revalidate inventory page as stock changed
  redirect("/sales")
}

export async function updateSale(
  id: string,
  prevState: { message: string; errors?: Record<string, string[]> },
  formData: FormData,
) {
  const validatedFields = saleSchema.safeParse({
    product_id: formData.get("product_id"),
    client_id: formData.get("client_id"),
    quantity: formData.get("quantity"),
    unit_price: formData.get("unit_price"),
    sale_date: formData.get("sale_date"),
  })

  if (!validatedFields.success) {
    return {
      message: "Erreurs de validation.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { product_id, client_id, quantity, unit_price, sale_date } = validatedFields.data
  const total_amount = quantity * unit_price

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch old quantity to adjust stock correctly
  const { data: oldSale, error: fetchError } = await supabase
    .from("sales")
    .select("quantity, product_id")
    .eq("id", id)
    .single()

  if (fetchError) {
    console.error("Error fetching old sale quantity:", fetchError)
    return { message: "Échec de la mise à jour de la vente." }
  }

  const oldQuantity = oldSale.quantity
  const oldProductId = oldSale.product_id

  // Check if enough stock is available for the new quantity
  if (oldProductId === product_id) {
    // Same product, check stock for the difference
    const stockChange = quantity - oldQuantity
    if (stockChange > 0) {
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("stock")
        .eq("id", product_id)
        .single()

      if (productError || !product) {
        console.error("Error fetching product stock for update:", productError)
        return { message: "Produit introuvable ou erreur de stock." }
      }

      if (product.stock < stockChange) {
        return { message: "Stock insuffisant pour cette modification de vente." }
      }
    }
  } else {
    // Product changed, check stock for the new product
    const { data: newProduct, error: newProductError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", product_id)
      .single()

    if (newProductError || !newProduct) {
      console.error("Error fetching new product stock for update:", newProductError)
      return { message: "Nouveau produit introuvable ou erreur de stock." }
    }

    if (newProduct.stock < quantity) {
      return { message: "Stock insuffisant pour le nouveau produit." }
    }
  }

  const { error } = await supabase
    .from("sales")
    .update({
      product_id,
      client_id,
      quantity,
      unit_price,
      total_amount,
      sale_date,
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error updating sale:", error)
    return { message: "Échec de la mise à jour de la vente." }
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

    const newStock = product.stock - stockChange
    const { error: updateError } = await supabase.from("products").update({ stock: newStock }).eq("id", product_id)

    if (updateError) {
      console.error("Error updating product stock:", updateError)
      return { message: "Échec de la mise à jour du stock du produit." }
    }
  } else {
    // Product changed, revert old product stock and subtract from new product stock
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
      .update({ stock: oldProduct.stock + oldQuantity })
      .eq("id", oldProductId)

    // Subtract from new product stock
    const { data: newProduct, error: newProductError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", product_id)
      .single()

    if (newProductError) {
      console.error("Error fetching new product stock for subtract:", newProductError)
      return { message: "Nouveau produit introuvable ou erreur de stock." }
    }

    await supabase
      .from("products")
      .update({ stock: newProduct.stock - quantity })
      .eq("id", product_id)
  }

  revalidatePath("/sales")
  revalidatePath("/inventory") // Revalidate inventory page as stock changed
  redirect("/sales")
}

export async function deleteSale(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await supabase.from("sales").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting sale:", error)
    return { message: "Échec de la suppression de la vente." }
  }

  // Fetch sale details to revert stock
  const { data: sale, error: fetchError } = await supabase
    .from("sales")
    .select("product_id, quantity")
    .eq("id", id)
    .single()

  if (fetchError) {
    console.error("Error fetching sale for deletion:", fetchError)
    return { message: "Échec de la suppression de la vente." }
  }

  // Revert product stock
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("stock")
    .eq("id", sale.product_id)
    .single()

  if (productError) {
    console.error("Error fetching product stock for revert:", productError)
    return { message: "Échec de la mise à jour du stock du produit." }
  }

  const newStock = product.stock + sale.quantity
  const { error: updateError } = await supabase.from("products").update({ stock: newStock }).eq("id", sale.product_id)

  if (updateError) {
    console.error("Error updating product stock:", updateError)
    return { message: "Échec de la mise à jour du stock du produit." }
  }

  revalidatePath("/sales")
  revalidatePath("/inventory") // Revalidate inventory page as stock changed
  return { message: "Vente supprimée avec succès." }
}
