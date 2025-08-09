import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import type { Sale } from "../supabase/types"

function getSupabase() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          // @ts-expect-error: cookies().set may not be available in RSC
          cookieStore.set(name, value, options as any)
        } catch {}
      },
      remove(name: string, options: CookieOptions) {
        try {
          // @ts-expect-error: cookies().delete may not be available in RSC
          cookieStore.delete(name, options as any)
        } catch {}
      },
    } as any,
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

  return (data ?? []) as Sale[]
}

export async function fetchSaleById(id: string): Promise<Sale | null> {
  noStore()
  const supabase = getSupabase()

  const { data, error } = await supabase.from("sales").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch sale.")
  }

  return (data ?? null) as Sale | null
}
