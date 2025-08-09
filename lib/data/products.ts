import "server-only"
import { unstable_noStore as noStore } from "next/cache"
import { getAdminClient } from "@/lib/supabase/admin"
import type { Product } from "@/lib/supabase/types"

export type ProductForSale = Pick<
  Product,
  "id" | "name" | "prix_vente_detail_1" | "prix_vente_detail_2" | "prix_vente_gros"
>
export type ProductForPurchase = Pick<Product, "id" | "name" | "prix_achat">

export async function fetchProductsForSaleForm(): Promise<ProductForSale[]> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from("products")
    .select("id, name, prix_vente_detail_1, prix_vente_detail_2, prix_vente_gros")
    .order("name", { ascending: true })

  if (error) {
    console.error("Database Error (fetchProductsForSaleForm):", error)
    throw new Error("Failed to fetch products for sale form.")
  }

  return (data ?? []).map((p) => ({ ...p, id: String(p.id), name: p.name ?? "" }))
}

export async function fetchProductsForPurchaseForm(): Promise<ProductForPurchase[]> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from("products")
    .select("id, name, prix_achat")
    .order("name", { ascending: true })

  if (error) {
    console.error("Database Error (fetchProductsForPurchaseForm):", error)
    throw new Error("Failed to fetch products for purchase form.")
  }

  return (data ?? []).map((p) => ({ ...p, id: String(p.id), name: p.name ?? "" }))
}

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

export async function fetchProductById(id: string): Promise<Product | null> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    console.error("Database Error (fetchProductById):", error)
    throw new Error("Failed to fetch product.")
  }

  return (data ?? null) as Product | null
}
