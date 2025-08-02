import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"

export async function fetchBankEntries() {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("bank_entries").select("*").order("date", { ascending: false })

  if (error) {
    console.error("Error fetching bank entries:", error)
    return []
  }
  return data
}

export async function fetchBankEntryById(id: string) {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("bank_entries").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching bank entry by ID:", error)
    return null
  }
  return data
}
