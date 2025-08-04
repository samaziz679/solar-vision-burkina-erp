import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import type { BankingAccount, BankingTransaction } from "@/lib/supabase/types"

export async function getBankingAccounts(userId: string): Promise<BankingAccount[]> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase
    .from("banking_accounts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching banking accounts:", error)
    throw new Error("Failed to fetch banking accounts.")
  }
  return data
}

export async function getBankingAccountById(id: string, userId: string): Promise<BankingAccount | null> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase
    .from("banking_accounts")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching banking account:", error)
    return null
  }
  return data
}

export async function getBankingTransactions(userId: string): Promise<BankingTransaction[]> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase
    .from("banking_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching banking transactions:", error)
    throw new Error("Failed to fetch banking transactions.")
  }
  return data
}

export async function getBankingTransactionById(id: string, userId: string): Promise<BankingTransaction | null> {
  noStore()
  const supabase = createClient()
  const { data, error } = await supabase
    .from("banking_transactions")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching banking transaction:", error)
    return null
  }
  return data
}
