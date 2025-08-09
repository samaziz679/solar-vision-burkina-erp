import { getAdminClient } from "@/lib/supabase/admin"
import type { BankingAccount } from "@/lib/supabase/types"

// Try a list of candidate tables to support schema variance.
const BANKING_TABLE_CANDIDATES = ["banking_accounts", "bank_accounts", "bank_entries"] as const

async function pickBankingTable(): Promise<string | null> {
  const supabase = getAdminClient()
  for (const table of BANKING_TABLE_CANDIDATES) {
    try {
      const { error } = await supabase.from(table).select("id").limit(1)
      if (!error) return table
    } catch {
      // ignore and try next
    }
  }
  return null
}

function mapBankingRow(row: Record<string, any>): BankingAccount {
  // Map loosely to the expected BankingAccount type.
  return {
    id: String(row.id ?? row.account_id ?? row.entry_id ?? ""),
    account_name: String(row.account_name ?? row.name ?? "Account"),
    account_number: String(row.account_number ?? row.number ?? ""),
    bank_name: String(row.bank_name ?? row.bank ?? ""),
    balance: Number(row.balance ?? row.current_balance ?? row.amount ?? 0),
    created_at: String(row.created_at ?? row.date ?? new Date().toISOString()),
    user_id: String(row.user_id ?? row.created_by ?? ""),
  }
}

export async function fetchBankingAccounts(): Promise<BankingAccount[]> {
  const supabase = getAdminClient()
  try {
    const table = await pickBankingTable()
    if (!table) {
      console.error("Banking: No compatible table found among", BANKING_TABLE_CANDIDATES)
      return []
    }
    const { data, error } = await supabase.from(table).select("*")
    if (error) {
      console.error(`Database Error (banking from ${table}):`, error)
      return []
    }
    const rows = (data ?? []) as Record<string, any>[]
    return rows.map(mapBankingRow)
  } catch (err) {
    console.error("Unexpected Error (banking):", err)
    return []
  }
}

export async function fetchBankingAccountById(id: string): Promise<BankingAccount | null> {
  const supabase = getAdminClient()
  try {
    const table = await pickBankingTable()
    if (!table) {
      console.error("Banking: No compatible table found among", BANKING_TABLE_CANDIDATES)
      return null
    }
    // Try multiple possible id field names via an OR filter.
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .or(`id.eq.${id},account_id.eq.${id},entry_id.eq.${id}`)
      .maybeSingle()

    if (error) {
      console.error(`Database Error (banking by id from ${table}):`, error)
      return null
    }
    if (!data) return null
    return mapBankingRow(data as Record<string, any>)
  } catch (err) {
    console.error("Unexpected Error (banking by id):", err)
    return null
  }
}
