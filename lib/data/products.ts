import "server-only"
import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { getAdminClient } from "@/lib/supabase/admin"
import type { Product } from "@/lib/supabase/types"

// Lightweight options type for dropdowns
export type ProductLite = Pick<Product, "id" | "name">

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
 * Product options for dropdowns (id, name)
 * Matches existing usage in pages/forms that need a small payload.
 */
export async function fetchProducts(): Promise<ProductLite[]> {
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("products").select("id,name").order("name", { ascending: true })

  if (error) throw error

  return (data ?? []).map((p: any) => ({
    id: String(p.id),
    name: String(p.name ?? ""),
  }))
}

/**
 * Single product by id (full row)
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  noStore()
  const supabase = getSupabase()

  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error (product by id):", error)
    throw new Error("Failed to fetch product.")
  }

  return (data ?? null) as Product | null
}
