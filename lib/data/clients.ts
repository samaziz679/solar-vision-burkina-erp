import { createClient } from "@/lib/supabase/server"
import type { Client } from "@/lib/supabase/types"
import { getUser } from "@/lib/auth"

export async function getClients(): Promise<Client[]> {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching clients:", error.message)
    return []
  }
  return data || []
}

export async function getClientById(id: string): Promise<Client | null> {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase.from("clients").select("*").eq("id", id).eq("user_id", user.id).single()

  if (error) {
    console.error("Error fetching client by ID:", error.message)
    return null
  }
  return data || null
}
