import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database, Sale } from "@/lib/supabase/types"

export async function getSales(): Promise<Sale[]> {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("sales")
    .select("*, products(name), clients(name)")
    .eq("user_id", user.id)
    .order("sale_date", { ascending: false })

  if (error) {
    console.error("Error fetching sales:", error)
    return []
  }

  return data as Sale[]
}

export async function getSaleById(id: string): Promise<Sale | null> {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from("sales")
    .select("*, products(name), clients(name)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("Error fetching sale by ID:", error)
    return null
  }

  return data as Sale
}
