import { unstable_noStore as noStore } from "next/cache"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Sale } from "../supabase/types"

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

export async function fetchSales(): Promise<Sale[]> {
  noStore()
  const supabase = getSupabase()
  const { data, error } = await supabase.from("sales").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch sales.")
  }

  return data
}

export async function fetchSaleById(id: string): Promise<Sale | null> {
  noStore()
  const supabase = getSupabase()
  const { data, error } = await supabase.from("sales").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch sale.")
  }

  return data
}
