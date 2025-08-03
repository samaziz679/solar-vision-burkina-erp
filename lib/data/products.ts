import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/lib/supabase/types"

type Product = Tables<"products">

export async function getProducts(userId: string): Promise<Product[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }
  return data
}

export async function getProductById(id: string, userId: string): Promise<Product | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("products").select("*").eq("id", id).eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching product by ID:", error)
    return null
  }
  return data
}
