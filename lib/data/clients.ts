import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import type { Client } from "@/lib/supabase/types"

export async function getClients(userId: string): Promise<Client[]> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", userId)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching clients:", error)
    throw new Error("Failed to fetch clients.")
  }
  return data
}

export async function getClientById(id: string, userId: string): Promise<Client | null> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("clients").select("*").eq("id", id).eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching client:", error)
    return null
  }
  return data
}
