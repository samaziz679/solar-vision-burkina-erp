import { createServerClient } from "@/lib/supabase/server"
import type { Client } from "@/lib/supabase/types"

export async function getClients(): Promise<Client[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("clients").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching clients:", error.message)
    return []
  }

  return data as Client[]
}

export async function getClientById(id: string): Promise<Client | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching client with ID ${id}:`, error.message)
    return null
  }

  return data as Client
}
