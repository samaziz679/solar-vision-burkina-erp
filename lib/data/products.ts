import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/supabase/types"
import { getUser } from "@/lib/auth"

export async function getProducts(): Promise<Product[]> {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error.message)
    return []
  }
  return data || []
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase.from("products").select("*").eq("id", id).eq("user_id", user.id).single()

  if (error) {
    console.error("Error fetching product by ID:", error.message)
    return null
  }
  return data || null
}
