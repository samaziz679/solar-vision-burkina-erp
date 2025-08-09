import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import type { Purchase } from "@/lib/supabase/types"

export async function getPurchases() {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("purchases").select("*").order("purchase_date", { ascending: false })

  if (error) {
    console.error("Error fetching purchases:", error)
    return []
  }

  return data as Purchase[]
}

export async function getPurchaseById(id: string) {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("purchases").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching purchase:", error)
    return null
  }

  return data as Purchase
}
