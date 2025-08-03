import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/types"

export async function fetchSales() {
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
    .from("sales")
    .select("*, products(name), clients(name)")
    .order("sale_date", { ascending: false })

  if (error) {
    console.error("Error fetching sales:", error)
    return []
  }

  return data.map((sale) => ({
    ...sale,
    product_name: sale.products?.name || "N/A",
    client_name: sale.clients?.name || "N/A",
  }))
}

export async function fetchSaleById(id: string) {
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

  const { data, error } = await supabase.from("sales").select("*, products(name), clients(name)").eq("id", id).single()

  if (error) {
    console.error("Error fetching sale by ID:", error)
    return null
  }

  return {
    ...data,
    product_name: data.products?.name || "N/A",
    client_name: data.clients?.name || "N/A",
  }
}
