import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import type { Client } from "@/lib/supabase/types"

export async function getClients() {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("clients").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching clients:", error)
    return []
  }

  return data as Client[]
}

export async function getClientById(id: string) {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching client:", error)
    return null
  }

  return data as Client
}
