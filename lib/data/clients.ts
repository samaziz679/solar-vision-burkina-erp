import { createClient } from "@/lib/supabase/server"
import type { Client } from "@/lib/supabase/types"

export async function getClients(userId: string): Promise<Client[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching clients:", error)
    return []
  }
  return data
}

export async function getClientById(clientId: string, userId: string): Promise<Client | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("clients").select("*").eq("id", clientId).eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching client by ID:", error)
    return null
  }
  return data
}
