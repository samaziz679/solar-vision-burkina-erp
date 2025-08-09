import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import type { Expense } from "../supabase/types"

function getSupabase() {
  const cookieStore = cookies()

  const cookieMethods = {
    get(name: string) {
      return cookieStore.get(name)?.value
    },
    set(_name: string, _value: string, _options: CookieOptions) {},
    remove(_name: string, _options: CookieOptions) {},
  }

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: cookieMethods as any,
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

  return (data ?? []) as Expense[]
}

export async function fetchExpenseById(id: string): Promise<Expense | null> {
  noStore()
  const supabase = getSupabase()

  const { data, error } = await supabase.from("expenses").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch expense.")
  }

  return (data ?? null) as Expense | null
}
