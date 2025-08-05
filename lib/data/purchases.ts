import { createClient } from "@/lib/supabase/server"
import type { Purchase } from "@/lib/supabase/types"
import { getUser } from "@/lib/auth"

export async function getPurchases(): Promise<Purchase[]> {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase
    .from("purchases")
    .select("*, products(name), suppliers(name)")
    .eq("user_id", user.id)
    .order("purchase_date", { ascending: false })

  if (error) {
    console.error("Error fetching purchases:", error.message)
    return []
  }
  return data || []
}

export async function getPurchaseById(id: string): Promise<Purchase | null> {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase
    .from("purchases")
    .select("*, products(name), suppliers(name)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("Error fetching purchase by ID:", error.message)
    return null
  }
  return data || null
}
