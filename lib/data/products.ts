import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import type { Product } from "@/lib/supabase/types"

export async function getProducts(userId: string): Promise<Product[]> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching products:", error)
    throw new Error("Failed to fetch products.")
  }
  return data
}

export async function getProductById(id: string, userId: string): Promise<Product | null> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("products").select("*").eq("id", id).eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }
  return data
}
