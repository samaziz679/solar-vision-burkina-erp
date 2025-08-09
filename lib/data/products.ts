import "server-only"
import { unstable_noStore as noStore } from "next/cache"
import { getAdminClient } from "@/lib/supabase/admin"
import type { Product } from "@/lib/supabase/types"

// Lightweight options for dropdowns (strictly existing fields)
export type ProductLite = Pick<Product, "id" | "name">

/**
 * Fetch all products (full rows).
 * This satisfies imports like:
 *   import { fetchProducts } from "@/lib/data/products"
 */
export async function fetchProducts(): Promise<Product[]> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database Error (fetchProducts):", error)
    throw new Error("Failed to fetch products.")
  }

  return (data ?? []) as Product[]
}

/**
 * Fetch a single product by id (full row).
 * Satisfies imports like:
 *   import { fetchProductById } from "@/lib/data/products"
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error (fetchProductById):", error)
    throw new Error("Failed to fetch product.")
  }

  return (data ?? null) as Product | null
}

/**
 * Product options for selects (id, name).
 */
export async function fetchProductOptions(): Promise<ProductLite[]> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("products").select("id,name").order("name", { ascending: true })

  if (error) {
    console.error("Database Error (fetchProductOptions):", error)
    throw new Error("Failed to fetch product options.")
  }

  return (data ?? []) as ProductLite[]
}
