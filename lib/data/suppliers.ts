import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import type { Supplier } from "@/lib/supabase/types"

export async function getSuppliers() {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("suppliers").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching suppliers:", error)
    return []
  }

  return data as Supplier[]
}

export async function getSupplierById(id: string) {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("suppliers").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching supplier:", error)
    return null
  }

  return data as Supplier
}
