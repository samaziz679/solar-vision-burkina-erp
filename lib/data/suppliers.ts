import { createServerClient } from "@/lib/supabase/server"
import { unstable_cache } from "next/cache"
import type { Supplier } from "@/lib/supabase/types"

export const getSuppliers = unstable_cache(
  async () => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("suppliers").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching suppliers:", error)
      return []
    }

    return data as Supplier[]
  },
  ["suppliers"],
  {
    tags: ["suppliers"],
  },
)

export const getSupplierById = unstable_cache(
  async (id: string) => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("suppliers").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching supplier:", error)
      return null
    }

    return data as Supplier
  },
  ["supplier"],
  {
    tags: ["supplier"],
  },
)
