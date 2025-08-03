import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/lib/supabase/types"

type Sale = Tables<"sales">

export async function getSales(userId: string): Promise<Sale[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("sales")
    .select("*, products(name), clients(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching sales:", error)
    return []
  }
  return data
}

export async function getSaleById(id: string, userId: string): Promise<Sale | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("sales")
    .select("*, products(name), clients(name)")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching sale by ID:", error)
    return null
  }
  return data
}
