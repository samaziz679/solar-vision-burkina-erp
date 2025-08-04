import { createClient } from "@/lib/supabase/server"
import type { Supplier } from "@/lib/supabase/types"

export async function getSuppliers(userId: string): Promise<Supplier[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching suppliers:", error)
    return []
  }
  return data
}

export async function getSupplierById(supplierId: string, userId: string): Promise<Supplier | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", supplierId)
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching supplier by ID:", error)
    return null
  }
  return data
}
