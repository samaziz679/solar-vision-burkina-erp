import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import type { Supplier } from "@/lib/supabase/types"

export async function getSuppliers(userId: string): Promise<Supplier[]> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching suppliers:", error)
    throw new Error("Failed to fetch suppliers.")
  }
  return data
}

export async function getSupplierById(id: string, userId: string): Promise<Supplier | null> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("suppliers").select("*").eq("id", id).eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching supplier:", error)
    return null
  }
  return data
}
