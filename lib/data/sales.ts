import { createServerClient } from "@/lib/supabase/server"
import { unstable_cache } from "next/cache"
import type { Sale } from "@/lib/supabase/types"

export const getSales = unstable_cache(
  async () => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("sales").select("*").order("sale_date", { ascending: false })

    if (error) {
      console.error("Error fetching sales:", error)
      return []
    }

    return data as Sale[]
  },
  ["sales"],
  {
    tags: ["sales"],
  },
)

export const getSaleById = unstable_cache(
  async (id: string) => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("sales").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching sale:", error)
      return null
    }

    return data as Sale
  },
  ["sale"],
  {
    tags: ["sale"],
  },
)
