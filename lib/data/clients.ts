import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import type { Client } from "../supabase/types"

function getSupabase() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set(name, value, options as any)
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.delete(name, options as any)
      },
    },
  })
}

export async function fetchClients(): Promise<Client[]> {
  noStore()
  const supabase = getSupabase()
  const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch clients.")
  }

  return (data ?? []) as Client[]
}

export async function fetchClientById(id: string): Promise<Client | null> {
  noStore()
  const supabase = getSupabase()
  const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch client.")
  }

  return (data ?? null) as Client | null
}
