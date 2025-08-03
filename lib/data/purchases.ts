import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database, Purchase } from "@/lib/supabase/types"

export async function getPurchases(): Promise<Purchase[]> {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("purchases")
    .select("*, products(name), suppliers(name)")
    .eq("user_id", user.id)
    .order("purchase_date", { ascending: false })

  if (error) {
    console.error("Error fetching purchases:", error)
    return []
  }

  return data as Purchase[]
}

export async function getPurchaseById(id: string): Promise<Purchase | null> {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from("purchases")
    .select("*, products(name), suppliers(name)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("Error fetching purchase by ID:", error)
    return null
  }

  return data as Purchase
}
