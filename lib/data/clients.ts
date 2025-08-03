import { createClient } from "@/lib/supabase/server"

export async function getClients(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching clients:", error)
    return []
  }
  return data
}

export async function getClientById(id: string, userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("clients").select("*").eq("id", id).eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching client:", error)
    return null
  }
  return data
}
