import { createServerClient } from "@/lib/supabase/server"
import type { Supplier } from "@/lib/supabase/types"

export async function getSuppliers(): Promise<Supplier[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("suppliers").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching suppliers:", error.message)
    return []
  }

  return data as Supplier[]
}

export async function getSupplierById(id: string): Promise<Supplier | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("suppliers").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching supplier with ID ${id}:`, error.message)
    return null
  }

  return data as Supplier
}
