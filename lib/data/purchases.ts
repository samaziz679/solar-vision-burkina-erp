import { createServerClient } from "@/lib/supabase/server"
import { unstable_cache } from "next/cache"
import type { Purchase } from "@/lib/supabase/types"

export const getPurchases = unstable_cache(
  async () => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("purchases").select("*").order("purchase_date", { ascending: false })

    if (error) {
      console.error("Error fetching purchases:", error)
      return []
    }

    return data as Purchase[]
  },
  ["purchases"],
  {
    tags: ["purchases"],
  },
)

export const getPurchaseById = unstable_cache(
  async (id: string) => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("purchases").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching purchase:", error)
      return null
    }

    return data as Purchase
  },
  ["purchase"],
  {
    tags: ["purchase"],
  },
)
