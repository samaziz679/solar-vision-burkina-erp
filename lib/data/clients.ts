import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import type { Client } from "../supabase/types"

function getSupabase() {
  const cookieStore = cookies()

  // Cross-version compatible CookieMethods for @supabase/ssr
  const cookieMethods = {
    get(name: string) {
      return cookieStore.get(name)?.value
    },
    // No-op in Server Components; method presence satisfies @supabase/ssr
    set(_name: string, _value: string, _options: CookieOptions) {},
    remove(_name: string, _options: CookieOptions) {},
  }

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: cookieMethods as any,
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
