import { createClient } from "@/lib/supabase/server"
import type { Sale } from "@/lib/supabase/types"
import { getUser } from "@/lib/auth"

export async function getSales(): Promise<Sale[]> {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase
    .from("sales")
    .select("*, products(name), clients(name)")
    .eq("user_id", user.id)
    .order("sale_date", { ascending: false })

  if (error) {
    console.error("Error fetching sales:", error.message)
    return []
  }
  return data || []
}

export async function getSaleById(id: string): Promise<Sale | null> {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase
    .from("sales")
    .select("*, products(name), clients(name)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("Error fetching sale by ID:", error.message)
    return null
  }
  return data || null
}
