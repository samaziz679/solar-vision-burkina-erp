import { unstable_noStore as noStore } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { Client } from "../supabase/types"

/**
 * Fetch all clients ordered by creation date (desc).
 * Uses the shared Supabase server client with a correct cookies adapter.
 */
export async function fetchClients(): Promise<Client[]> {
  noStore()
  const supabase = createClient()

  const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database Error (clients):", error)
    throw new Error("Failed to fetch clients.")
  }

  return (data ?? []) as Client[]
}

/**
 * Fetch a single client by id.
 */
export async function fetchClientById(id: string): Promise<Client | null> {
  noStore()
  const supabase = createClient()

  const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error (client by id):", error)
    throw new Error("Failed to fetch client.")
  }

  return (data ?? null) as Client | null
}
