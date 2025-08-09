import { unstable_noStore as noStore } from "next/cache"
import { getAdminClient } from "@/lib/supabase/admin"
import type { Client } from "../supabase/types"

/**
 * Server-side reads use the admin client to avoid any cookies dependency.
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
