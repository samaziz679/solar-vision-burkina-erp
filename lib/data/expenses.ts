import { unstable_noStore as noStore } from "next/cache"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Expense } from "../supabase/types"

function getSupabase() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options: any) => cookieStore.set(name, value, options),
      remove: (name: string, options: any) => cookieStore.delete(name, options),
    },
  })
}

export async function fetchExpenses(): Promise<Expense[]> {
  noStore()
  const supabase = getSupabase()
  const { data, error } = await supabase.from("expenses").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch expenses.")
  }

  return data
}

export async function fetchExpenseById(id: string): Promise<Expense | null> {
  noStore()
  const supabase = getSupabase()
  const { data, error } = await supabase.from("expenses").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch expense.")
  }

  return data
}
