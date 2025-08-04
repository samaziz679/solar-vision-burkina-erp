import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import type { Purchase } from "@/lib/supabase/types"

export async function getPurchases(userId: string): Promise<Purchase[]> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase
    .from("purchases")
    .select("*, products(name), suppliers(name)") // Fetch related product and supplier names
    .eq("user_id", userId)
    .order("purchase_date", { ascending: false })

  if (error) {
    console.error("Error fetching purchases:", error)
    throw new Error("Failed to fetch purchases.")
  }
  return data
}

export async function getPurchaseById(id: string, userId: string): Promise<Purchase | null> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase
    .from("purchases")
    .select("*, products(name), suppliers(name)")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching purchase:", error)
    return null
  }
  return data
}
