import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import type { Sale } from "@/lib/supabase/types"

export async function getSales() {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("sales").select("*").order("sale_date", { ascending: false })

  if (error) {
    console.error("Error fetching sales:", error)
    return []
  }

  return data as Sale[]
}

export async function getSaleById(id: string) {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("sales").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching sale:", error)
    return null
  }

  return data as Sale
}
