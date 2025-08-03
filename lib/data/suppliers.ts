import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database, Supplier } from "@/lib/supabase/types"

export async function getSuppliers(): Promise<Supplier[]> {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching suppliers:", error)
    return []
  }

  return data as Supplier[]
}

export async function getSupplierById(id: string): Promise<Supplier | null> {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase.from("suppliers").select("*").eq("id", id).eq("user_id", user.id).single()

  if (error) {
    console.error("Error fetching supplier by ID:", error)
    return null
  }

  return data as Supplier
}
