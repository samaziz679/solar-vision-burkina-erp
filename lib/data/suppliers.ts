import { createClient } from "@/lib/supabase/server"
import type { Supplier } from "@/lib/supabase/types"
import { getUser } from "@/lib/auth"

export async function getSuppliers(): Promise<Supplier[]> {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching suppliers:", error.message)
    return []
  }
  return data || []
}

export async function getSupplierById(id: string): Promise<Supplier | null> {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase.from("suppliers").select("*").eq("id", id).eq("user_id", user.id).single()

  if (error) {
    console.error("Error fetching supplier by ID:", error.message)
    return null
  }
  return data || null
}
