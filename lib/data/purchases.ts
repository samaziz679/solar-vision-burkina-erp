import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import type { Purchase } from "../supabase/types"

function getSupabase() {
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: () => {
      const cookieStore = cookies()
      return {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(_name: string, _value: string, _options: CookieOptions) {},
        remove(_name: string, _options: CookieOptions) {},
      }
    },
  })
}

export async function fetchPurchases(): Promise<Purchase[]> {
  noStore()
  const supabase = getSupabase()
  const { data, error } = await supabase.from("purchases").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch purchases.")
  }

  return (data ?? []) as Purchase[]
}

export async function fetchPurchaseById(id: string): Promise<Purchase | null> {
  noStore()
  const supabase = getSupabase()
  const { data, error } = await supabase.from("purchases").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch purchase.")
  }

  return (data ?? null) as Purchase | null
}
