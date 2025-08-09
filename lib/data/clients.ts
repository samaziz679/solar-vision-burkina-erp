import "server-only"
import { unstable_noStore as noStore } from "next/cache"
import { getAdminClient } from "@/lib/supabase/admin"
import type { Client, ClientLite } from "../supabase/types"

/**
 * Server-side reads use the admin client to avoid any cookies dependency.
 */
export async function fetchClients(): Promise<ClientLite[]> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("clients").select("id,name").order("name", { ascending: true })
  if (error) throw error
  return (data ?? []).map((c: any) => ({ id: String(c.id), name: String(c.name ?? "") }))
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
