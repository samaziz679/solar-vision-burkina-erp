import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import type { Supplier } from "../supabase/types"

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

export async function fetchSuppliers(): Promise<Supplier[]> {
  noStore()
  const supabase = getSupabase()
  const { data, error } = await supabase.from("suppliers").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch suppliers.")
  }

  return (data ?? []) as Supplier[]
}

export async function fetchSupplierById(id: string): Promise<Supplier | null> {
  noStore()
  const supabase = getSupabase()
  const { data, error } = await supabase.from("suppliers").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch supplier.")
  }

  return (data ?? null) as Supplier | null
}
