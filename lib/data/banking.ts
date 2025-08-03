import { createClient } from "@/lib/supabase/server"
import type { Tables } from "@/lib/supabase/types"

type BankingTransaction = Tables<"banking_transactions">

export async function getBankingTransactions(userId: string): Promise<BankingTransaction[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("banking_transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching banking transactions:", error)
    return []
  }
  return data
}

export async function getBankingTransactionById(id: string, userId: string): Promise<BankingTransaction | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("banking_transactions")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("Error fetching banking transaction by ID:", error)
    return null
  }
  return data
}
