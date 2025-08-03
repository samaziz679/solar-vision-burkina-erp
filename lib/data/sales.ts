import { createClient } from "@/lib/supabase/server"

export async function getSales(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("sales")
    .select("*, products(name), clients(name)")
    .eq("user_id", userId)
    .order("sale_date", { ascending: false })

  if (error) {
    console.error("Error fetching sales:", error)
    return []
  }
  return data
}

export async function getSaleById(id: string, userId: string) {
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
