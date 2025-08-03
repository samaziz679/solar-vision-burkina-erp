import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/types"

export async function fetchPurchases() {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.delete({ name, ...options })
      },
    },
  })

  const { data, error } = await supabase
    .from("purchases")
    .select("*, products(name), suppliers(name)")
    .order("purchase_date", { ascending: false })

  if (error) {
    console.error("Error fetching purchases:", error)
    return []
  }

  return data.map((purchase) => ({
    ...purchase,
    product_name: purchase.products?.name || "N/A",
    supplier_name: purchase.suppliers?.name || "N/A",
  }))
}

export async function fetchPurchaseById(id: string) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.delete({ name, ...options })
      },
    },
  })

  const { data, error } = await supabase
    .from("purchases")
    .select("*, products(name), suppliers(name)")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching purchase by ID:", error)
    return null
  }

  return {
    ...data,
    product_name: data.products?.name || "N/A",
    supplier_name: data.suppliers?.name || "N/A",
  }
}
