import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import type { Banking } from "@/lib/supabase/types"

export async function getBankingEntries() {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("banking").select("*").order("date", { ascending: false })

  if (error) {
    console.error("Error fetching banking entries:", error)
    return []
  }

  return data as Banking[]
}

export async function getBankingEntryById(id: string) {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("banking").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching banking entry:", error)
    return null
  }

  return data as Banking
}
