import { unstable_noStore as noStore } from "next/cache"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Purchase } from "../supabase/types"

function getSupabase() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) => cookieStore.set(name, value, options),
      remove: (name: string, options: any) => cookieStore.delete(name, options),
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

  return data
}

export async function fetchPurchaseById(id: string): Promise<Purchase | null> {
  noStore()
  const supabase = getSupabase()
  const { data, error } = await supabase.from("purchases").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch purchase.")
  }

  return data
}
