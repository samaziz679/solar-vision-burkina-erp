import { createServerClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/supabase/types"

export async function getProducts(): Promise<Product[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("products").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching products:", error.message)
    return []
  }

  return data as Product[]
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching product with ID ${id}:`, error.message)
    return null
  }

  return data as Product
}
