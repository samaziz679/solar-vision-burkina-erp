import { createClient } from "@/lib/supabase/server"
import type { BankingAccount, BankingTransaction } from "@/lib/supabase/types"
import { getUser } from "@/lib/auth"

export async function getBankingAccounts(): Promise<BankingAccount[]> {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase
    .from("banking_accounts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching banking accounts:", error.message)
    return []
  }
  return data || []
}

export async function getBankingAccountById(id: string): Promise<BankingAccount | null> {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase
    .from("banking_accounts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("Error fetching banking account by ID:", error.message)
    return null
  }
  return data || null
}

export async function getBankingTransactions(accountId?: string): Promise<BankingTransaction[]> {
  const supabase = createClient()
  const user = await getUser()

  let query = supabase.from("banking_transactions").select("*").eq("user_id", user.id)

  if (accountId) {
    query = query.eq("account_id", accountId)
  }

  const { data, error } = await query.order("date", { ascending: false })

  if (error) {
    console.error("Error fetching banking transactions:", error.message)
    return []
  }
  return data || []
}

export async function getBankingTransactionById(id: string): Promise<BankingTransaction | null> {
  const supabase = createClient()
  const user = await getUser()

  const { data, error } = await supabase
    .from("banking_transactions")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error("Error fetching banking transaction by ID:", error.message)
    return null
  }
  return data || null
}
