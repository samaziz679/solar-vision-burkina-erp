import { createServerClient } from "@/lib/supabase/server"
import { unstable_cache } from "next/cache"
import type { BankEntry } from "@/lib/supabase/types"

export const getBankEntries = unstable_cache(
  async () => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("bank_entries").select("*").order("date", { ascending: false })

    if (error) {
      console.error("Error fetching bank entries:", error)
      return []
    }

    return data as BankEntry[]
  },
  ["bank_entries"],
  {
    tags: ["bank_entries"],
  },
)

export const getBankEntryById = unstable_cache(
  async (id: string) => {
    const supabase = await createServerClient()
    const { data, error } = await supabase.from("bank_entries").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching bank entry:", error)
      return null
    }

    return data as BankEntry
  },
  ["bank_entry"],
  {
    tags: ["bank_entry"],
  },
)
