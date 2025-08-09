import "server-only"
import { unstable_noStore as noStore } from "next/cache"
import { getAdminClient } from "@/lib/supabase/admin"
import type { Product } from "@/lib/supabase/types"

// Explicitly define the shape for the Sale Form
export type ProductForSale = {
  id: string
  name: string
  prix_vente_detail_1: number | null
  prix_vente_detail_2: number | null
  prix_vente_gros: number | null
}

// Explicitly define the shape for the Purchase Form
export type ProductForPurchase = {
  id: string
  name: string
  prix_achat: number | null
}

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

  // Ensure correct types on return
  return (data ?? []).map((p) => ({
    id: String(p.id),
    name: p.name ?? "",
    prix_vente_detail_1: p.prix_vente_detail_1 as number | null,
    prix_vente_detail_2: p.prix_vente_detail_2 as number | null,
    prix_vente_gros: p.prix_vente_gros as number | null,
  }))
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

  // Ensure correct types on return
  return (data ?? []).map((p) => ({
    id: String(p.id),
    name: p.name ?? "",
    prix_achat: p.prix_achat as number | null,
  }))
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
    // It's common for a single record not to be found, so we can return null gracefully.
    if (error.code === "PGRST116") {
      return null
    }
    console.error("Database Error (fetchProductById):", error)
    throw new Error("Failed to fetch product.")
  }

  return (data ?? null) as Product | null
}
