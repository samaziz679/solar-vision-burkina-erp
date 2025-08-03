import { createClient } from "@/lib/supabase/server"

export async function getPurchases(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("purchases")
    .select("*, products(name), suppliers(name)")
    .eq("user_id", userId)
    .order("purchase_date", { ascending: false })

  if (error) {
    console.error("Error fetching purchases:", error)
    return []
  }
  return data
}

export async function getPurchaseById(id: string, userId: string) {
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
