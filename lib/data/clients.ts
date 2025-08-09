"use server"

import { unstable_noStore as noStore } from "next/cache"
import { getAdminClient } from "@/lib/supabase/admin"
import type { Database } from "@/lib/supabase/types"

export type Client = Database["public"]["Tables"]["clients"]["Row"]
export type ClientLite = { id: string; name: string }

/**
 * Server-side reads use the admin client to avoid any cookies dependency.
 */
export async function fetchClients(): Promise<ClientLite[]> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("clients").select("id,name").order("name", { ascending: true })

  if (error) {
    console.error("Database Error (clients):", error)
    throw new Error("Failed to fetch clients.")
  }

  return (data ?? []).map((c: any) => ({
    id: String(c.id),
    name: String(c.name ?? ""),
  }))
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
