import { createServerClient } from "@/lib/supabase/server"
import { unstable_cache } from "next/cache"
import type { Product } from "@/lib/supabase/types"

export const getProducts = unstable_cache(
  async () => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return []
    }

    return data as Product[]
  },
  ["products"],
  {
    tags: ["products"],
  },
)

export const getProductById = unstable_cache(
  async (id: string) => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching product:", error)
      return null
    }

    return data as Product
  },
  ["product"],
  {
    tags: ["product"],
  },
)
