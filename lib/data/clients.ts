import { createServerClient } from "@/lib/supabase/server"
import { unstable_cache } from "next/cache"
import type { Client } from "@/lib/supabase/types"

export const getClients = unstable_cache(
  async () => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching clients:", error)
      return []
    }

    return data as Client[]
  },
  ["clients"],
  {
    tags: ["clients"],
  },
)

export const getClientById = unstable_cache(
  async (id: string) => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching client:", error)
      return null
    }

    return data as Client
  },
  ["client"],
  {
    tags: ["client"],
  },
)
