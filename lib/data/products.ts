import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import type { Product } from "../supabase/types"

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

export async function fetchProducts(): Promise<Product[]> {
  noStore()
  const supabase = getSupabase()
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch products.")
  }

  return (data ?? []) as Product[]
}

export async function fetchProductById(id: string): Promise<Product | null> {
  noStore()
  const supabase = getSupabase()
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch product.")
  }

  return (data ?? null) as Product | null
}
