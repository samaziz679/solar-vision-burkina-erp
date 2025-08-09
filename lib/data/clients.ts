import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import type { Client } from "../supabase/types"

function getSupabase() {
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    // Use the callback form; provide get/set/remove methods.
    cookies: () => {
      const cookieStore = cookies()
      return {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // No-ops in RSC; method signatures must exist for @supabase/ssr
        set(_name: string, _value: string, _options: CookieOptions) {},
        remove(_name: string, _options: CookieOptions) {},
      }
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
