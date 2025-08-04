import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/supabase/types"

export async function getProducts(userId: string): Promise<Product[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }
  return data
}

export async function getProductById(productId: string, userId: string): Promise<Product | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("products").select("*").eq("id", productId).eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching product by ID:", error)
    return null
  }
  return data
}
