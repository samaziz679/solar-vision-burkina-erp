import "server-only"
import { unstable_noStore as noStore } from "next/cache"
import { getAdminClient } from "@/lib/supabase/admin"
import type { Product } from "@/lib/supabase/types"

// Lightweight options for selects
export type ProductLite = Pick<Product, "id" | "name" | "sku" | "price" | "stock_quantity">

/**
 * Full list of products (used by inventory, selects that need full data, etc.)
 */
export async function fetchProducts(): Promise<Product[]> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database Error (products):", error)
    throw new Error("Failed to fetch products.")
  }

  return (data ?? []) as Product[]
}

/**
 * Product options for dropdowns (id, name, sku, price, stock_quantity).
 */
export async function fetchProductOptions(): Promise<ProductLite[]> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("products").select("id,name,sku,price,stock_quantity")
  if (error) {
    console.error("Database Error (product options):", error)
    throw new Error("Failed to fetch product options.")
  }
  return (data ?? []) as ProductLite[]
}

/**
 * Single product by id.
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error (product by id):", error)
    throw new Error("Failed to fetch product.")
  }

  return (data ?? null) as Product | null
}
