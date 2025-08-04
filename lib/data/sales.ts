import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import type { Sale } from "@/lib/supabase/types"

export async function getSales(userId: string): Promise<Sale[]> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase
    .from("sales")
    .select("*, products(name), clients(name)") // Fetch related product and client names
    .eq("user_id", userId)
    .order("sale_date", { ascending: false })

  if (error) {
    console.error("Error fetching sales:", error)
    throw new Error("Failed to fetch sales.")
  }
  return data
}

export async function getSaleById(id: string, userId: string): Promise<Sale | null> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase
    .from("sales")
    .select("*, products(name), clients(name)")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching sale:", error)
    return null
  }
  return data
}
