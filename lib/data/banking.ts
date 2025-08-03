import { createServerClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import type { BankEntry } from "@/lib/supabase/types"

export async function fetchBankEntries(): Promise<BankEntry[]> {
  noStore() // Opt-out of static rendering for this data fetch
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("bank_entries").select("*").order("date", { ascending: false })

  if (error) {
    console.error("Error fetching bank entries:", error.message)
    return []
  }
  return data as BankEntry[]
}

export async function getBankEntryById(id: string): Promise<BankEntry | null> {
  noStore() // Opt-out of static rendering for this data fetch
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("bank_entries").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching bank entry with ID ${id}:`, error.message)
    return null
  }
  return data as BankEntry
}
