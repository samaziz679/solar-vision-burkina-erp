import { unstable_noStore as noStore } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { BankEntry } from "@/lib/supabase/types"

export async function fetchBankEntries() {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase
    .from("bank_entries")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch bank entries.")
  }
  return data as BankEntry[]
}

export async function fetchBankEntryById(id: string) {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("bank_entries").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch bank entry.")
  }
  return data as BankEntry
}

