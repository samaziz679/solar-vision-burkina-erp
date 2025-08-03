import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/lib/supabase/types"

type Supplier = Tables<"suppliers">

export async function getSuppliers(userId: string): Promise<Supplier[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching suppliers:", error)
    return []
  }
  return data
}

export async function getSupplierById(id: string, userId: string): Promise<Supplier | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("suppliers").select("*").eq("id", id).eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching supplier by ID:", error)
    return null
  }
  return data
}
