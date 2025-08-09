import { getAdminClient } from "@/lib/supabase/admin"

export type BankingAccount = {
  id: number | string
  name?: string | null
  account_name?: string | null
  balance?: number | null
  current_balance?: number | null
  created_at?: string | null
}

/**
 * Fetch Banking Accounts with graceful fallbacks.
 * - Prefer a table named "banking_accounts" or "bank_accounts".
 * - If neither exists, return an empty list instead of throwing.
 */
export async function fetchBankingAccounts(): Promise<BankingAccount[]> {
  const supabase = getAdminClient()

  // Try common table names in order.
  const candidates = ["banking_accounts", "bank_accounts"]

  for (const table of candidates) {
    const { data, error } = await supabase
      .from(table as any)
      .select("*")
      .limit(1000)
    if (!error && Array.isArray(data)) {
      return data as BankingAccount[]
    }
    if (error && error.code !== "PGRST205") {
      console.error("Database Error (banking):", error)
      // Try next fallback instead of throwing.
    }
  }

  // If a legacy "bank_entries" exists, we don't try to aggregate guesses here.
  // Return [] safely so the page renders without crashing.
  // You can tell me the exact accounts table name and columns; I’ll wire it explicitly.
  console.warn("Banking accounts table not found (tried banking_accounts, bank_accounts). Returning empty list.")
  return []
}
