import { createClient } from "@/lib/supabase/server"

export async function getSuppliers(userId: string) {
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

export async function getSupplierById(id: string, userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("suppliers").select("*").eq("id", id).eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching supplier:", error)
    return null
  }
  return data
}
