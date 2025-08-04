import { createClient } from "@/lib/supabase/server"
import type { BankingAccount, BankingTransaction } from "@/lib/supabase/types"

export async function getBankingAccounts(userId: string): Promise<BankingAccount[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("banking_accounts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching banking accounts:", error)
    return []
  }
  return data
}

export async function getBankingTransactions(userId: string): Promise<BankingTransaction[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("banking_transactions")
    .select("*, banking_accounts(name)") // Select account name from related table
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching banking transactions:", error)
    return []
  }

  // Map the data to include the account name directly in the transaction object
  return data.map((transaction) => ({
    ...transaction,
    account_name: (transaction.banking_accounts as { name: string }).name,
  })) as BankingTransaction[]
}

export async function getBankingTransactionById(
  transactionId: string,
  userId: string,
): Promise<BankingTransaction | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("banking_transactions")
    .select("*, banking_accounts(name)")
    .eq("id", transactionId)
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching banking transaction by ID:", error)
    return null
  }

  if (data) {
    return {
      ...data,
      account_name: (data.banking_accounts as { name: string }).name,
    } as BankingTransaction
  }
  return null
}
