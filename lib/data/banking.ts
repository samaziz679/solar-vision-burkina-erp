import { getAdminClient } from "@/lib/supabase/admin"
import type { PostgrestError } from "@supabase/supabase-js"
import type { BankingAccount } from "@/lib/supabase/types"

/**
 * Some projects name this table "banking_accounts" (what your UI expects),
 * others use "bank_accounts" or "bank_entries".
 * We’ll try a short cascade so Production doesn’t 500 if the name differs.
 */
const BANK_TABLE_CANDIDATES = ["banking_accounts", "bank_accounts", "bank_entries"] as const

function mapToBankingAccount(row: any): BankingAccount {
  // Normalize possible column variants to the UI’s expected shape.
  return {
    id: String(row.id ?? ""),
    bank_name: (row.bank_name ?? row.bank ?? row.banklabel ?? "") as string,
    account_name: (row.account_name ?? row.name ?? row.account_label ?? "") as string,
    account_number: (row.account_number ?? row.number ?? row.account_no ?? "") as string,
    balance: Number(row.balance ?? row.current_balance ?? row.amount ?? row.available_balance ?? 0),
    created_at: (row.created_at ?? row.createdAt ?? null) as string | null,
    user_id: (row.user_id ?? row.owner_id ?? row.created_by ?? null) as string | null,
  }
}

async function selectManyFromFirstExisting(limit = 1000) {
  const supabase = getAdminClient()
  let lastError: PostgrestError | null = null

  for (const table of BANK_TABLE_CANDIDATES) {
    const { data, error } = await supabase.from(table).select("*").limit(limit)
    if (!error) {
      return { table, rows: (data ?? []).map(mapToBankingAccount) as BankingAccount[] }
    }
    lastError = error
    // PGRST205 = table not in schema cache; try next candidate.
    if (error.code !== "PGRST205") {
      // Log non-trivial errors but still try next candidate.
      console.error("Database Error (banking list):", error)
    }
  }

  if (lastError) {
    console.warn("Banking tables not found in any candidate; returning empty list.")
  }
  return { table: null as unknown as string, rows: [] as BankingAccount[] }
}

async function selectByIdFromFirstExisting(id: string) {
  const supabase = getAdminClient()
  let lastError: PostgrestError | null = null

  for (const table of BANK_TABLE_CANDIDATES) {
    const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle()
    if (!error) {
      return { table, row: data ? mapToBankingAccount(data) : null }
    }
    lastError = error
    if (error.code !== "PGRST205") {
      console.error("Database Error (banking by id):", error)
    }
  }

  if (lastError) {
    console.warn("Banking row not found for any candidate table; returning null.")
  }
  return { table: null as unknown as string, row: null as BankingAccount | null }
}

/**
 * Public API used by pages/components
 */
export async function fetchBankingAccounts(): Promise<BankingAccount[]> {
  const { rows } = await selectManyFromFirstExisting(1000)
  return rows
}

export async function fetchBankingAccountById(id: string): Promise<BankingAccount | null> {
  const { row } = await selectByIdFromFirstExisting(id)
  return row
}
