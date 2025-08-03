import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database, BankEntry } from "@/lib/supabase/types"

export async function getBankEntries(): Promise<BankEntry[]> {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("bank_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching bank entries:", error)
    return []
  }

  return data as BankEntry[]
}

export async function getBankEntryById(id: string): Promise<BankEntry | null> {
  const supabase = createServerActionClient<Database>({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase.from("bank_entries").select("*").eq("id", id).eq("user_id", user.id).single()

  if (error) {
    console.error("Error fetching bank entry by ID:", error)
    return null
  }

  return data as BankEntry
}
