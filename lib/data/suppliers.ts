import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/types"

export async function fetchSuppliers() {
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

  const { data, error } = await supabase.from("suppliers").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching suppliers:", error)
    return []
  }

  return data
}

export async function fetchSupplierById(id: string) {
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

  const { data, error } = await supabase.from("suppliers").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching supplier by ID:", error)
    return null
  }

  return data
}
