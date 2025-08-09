import "server-only"
import { unstable_noStore as noStore } from "next/cache"
import { getAdminClient } from "@/lib/supabase/admin"
import type { Client } from "@/lib/supabase/types"

// Lightweight options for selects
export type ClientLite = Pick<Client, "id" | "name">

/**
 * Full list of clients for pages like /clients (preserves existing shape).
 */
export async function fetchClients(): Promise<Client[]> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database Error (clients):", error)
    throw new Error("Failed to fetch clients.")
  }

  return (data ?? []) as Client[]
}

/**
 * Options for dropdowns (id, name) to avoid over-fetching.
 */
export async function fetchClientOptions(): Promise<ClientLite[]> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("clients").select("id,name").order("name", { ascending: true })

  if (error) {
    console.error("Database Error (client options):", error)
    throw new Error("Failed to fetch client options.")
  }

  return (data ?? []) as ClientLite[]
}

/**
 * Single client by id.
 */
export async function fetchClientById(id: string): Promise<Client | null> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error (client by id):", error)
    throw new Error("Failed to fetch client.")
  }

  return (data ?? null) as Client | null
}
