import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database, Client } from "@/lib/supabase/types"

export async function getClients(): Promise<Client[]> {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching clients:", error)
    return []
  }

  return data as Client[]
}

export async function getClientById(id: string): Promise<Client | null> {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase.from("clients").select("*").eq("id", id).eq("user_id", user.id).single()

  if (error) {
    console.error("Error fetching client by ID:", error)
    return null
  }

  return data as Client
}
