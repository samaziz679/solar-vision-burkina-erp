import "server-only"
import { unstable_noStore as noStore } from "next/cache"
import { getAdminClient } from "@/lib/supabase/admin"
import type { Client } from "@/lib/supabase/types"

// Lightweight options for dropdowns (strictly existing fields)
export type ClientLite = Pick<Client, "id" | "name">

/**
 * Fetch all clients (full rows).
 */
export async function fetchClients(): Promise<Client[]> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database Error (fetchClients):", error)
    throw new Error("Failed to fetch clients.")
  }

  return (data ?? []) as Client[]
}

/**
 * Fetch a single client by id (full row).
 */
export async function fetchClientById(id: string): Promise<Client | null> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error (fetchClientById):", error)
    throw new Error("Failed to fetch client.")
  }

  return (data ?? null) as Client | null
}

/**
 * Client options for selects (id, name).
 */
export async function fetchClientOptions(): Promise<ClientLite[]> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("clients").select("id,name").order("name", { ascending: true })

  if (error) {
    console.error("Database Error (fetchClientOptions):", error)
    throw new Error("Failed to fetch client options.")
  }

  return (data ?? []) as ClientLite[]
}
