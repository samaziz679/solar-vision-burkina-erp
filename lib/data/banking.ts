import { unstable_noStore as noStore } from "next/cache"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { BankingAccount } from "../supabase/types"

function createSupabaseForRSC() {
  // In Server Components you can read cookies but cannot set/remove them.
  // Provide no-op implementations for set/remove to satisfy SSR helper types.
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookies().get(name)?.value
      },
      set(_name: string, _value: string, _options: CookieOptions) {
        // no-op in Server Components (setting cookies is not supported here)
      },
      remove(_name: string, _options: CookieOptions) {
        // no-op in Server Components (removing cookies is not supported here)
      },
    },
  })
}

export async function fetchBankingAccounts(): Promise<BankingAccount[]> {
  noStore()
  const supabase = createSupabaseForRSC()

  const { data, error } = await supabase.from("banking_accounts").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch banking accounts.")
  }

  return data ?? []
}

export async function fetchBankingAccountById(id: string): Promise<BankingAccount | null> {
  noStore()
  const supabase = createSupabaseForRSC()

  const { data, error } = await supabase.from("banking_accounts").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch banking account.")
  }

  return data
}
