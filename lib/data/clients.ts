import "server-only"
import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { getAdminClient } from "@/lib/supabase/admin"
import type { Client } from "../supabase/types"

// Local lightweight type for selects
export type ClientLite = Pick<Client, "id" | "name">

function getSupabase() {
  const cookieStore = cookies()

  const cookieMethods = {
    get(name: string) {
      return cookieStore.get(name)?.value
    },
    set(_name: string, _value: string, _options: CookieOptions) {},
    remove(_name: string, _options: CookieOptions) {},
  }

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: cookieMethods as any,
  })
}

/**
 * List clients (id, name) for dropdowns
 */
export async function fetchClients(): Promise<ClientLite[]> {
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("clients").select("id,name").order("name", { ascending: true })

  if (error) throw error

  return (data ?? []).map((c: any) => ({
    id: String(c.id),
    name: String(c.name ?? ""),
  }))
}

/**
 * Full client by id (session-aware)
 */
export async function fetchClientById(id: string): Promise<Client | null> {
  noStore()
  const supabase = getSupabase()

  const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error (fetchClientById):", error)
    throw new Error("Failed to fetch client.")
  }

  return (data ?? null) as Client | null
}
