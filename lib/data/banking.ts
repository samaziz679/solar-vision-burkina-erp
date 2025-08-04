import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { BankingAccount } from "@/lib/supabase/types"

export async function getBankingAccounts(userId: string) {
  const cookieStore = cookies()
  const supabase = createServerClient({
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

  const { data, error } = await supabase
    .from("banking_accounts")
    .select("*")
    .eq("user_id", userId) // Assuming banking accounts are tied to a user
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching banking accounts:", error)
    return { bankingAccounts: null, error }
  }

  return { bankingAccounts: data as BankingAccount[], error: null }
}

export async function getBankingAccountById(id: string, userId: string) {
  const cookieStore = cookies()
  const supabase = createServerClient({
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

  const { data, error } = await supabase
    .from("banking_accounts")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId) // Ensure user owns the account
    .single()

  if (error) {
    console.error("Error fetching banking account by ID:", error)
    return { bankingAccount: null, error }
  }

  return { bankingAccount: data as BankingAccount, error: null }
}
