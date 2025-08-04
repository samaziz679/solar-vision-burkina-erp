import { createClient } from "@/lib/supabase/server"
import type { BankingTransaction, BankingAccount } from "@/lib/supabase/types"

export async function getBankingAccounts(): Promise<BankingAccount[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("banking_accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching banking accounts:", error)
    return []
  }

  return data as BankingAccount[]
}

export async function getBankingTransactions(accountId?: string): Promise<BankingTransaction[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  let query = supabase.from("banking_transactions").select("*").eq("user_id", user.id)

  if (accountId) {
    query = query.eq("account_id", accountId)
  }

  const { data, error } = await query.order("date", { ascending: false })

  if (error) {
    console.error("Error fetching banking transactions:", error)
    return []
  }

  return data as BankingTransaction[]
}

export async function getBankingTransactionById(id: string): Promise<BankingTransaction | null> {
  const supabase = createClient()
  const {
    data: { user } = { user: null },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from("banking_transactions")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("Error fetching banking transaction by ID:", error)
    return null
  }

  return data as BankingTransaction
}
