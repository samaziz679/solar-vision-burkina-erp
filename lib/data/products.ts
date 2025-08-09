import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import type { Product } from "@/lib/supabase/types"

export async function getProducts() {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("products").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data as Product[]
}

export async function getProductById(id: string) {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return data as Product
}
