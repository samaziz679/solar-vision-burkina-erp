import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/lib/supabase/types"

type Purchase = Tables<"purchases">

export async function getPurchases(userId: string): Promise<Purchase[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("purchases")
    .select("*, products(name), suppliers(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching purchases:", error)
    return []
  }
  return data
}

export async function getPurchaseById(id: string, userId: string): Promise<Purchase | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("purchases")
    .select("*, products(name), suppliers(name)")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching purchase by ID:", error)
    return null
  }
  return data
}
