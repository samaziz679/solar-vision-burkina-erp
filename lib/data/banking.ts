import { getAdminClient } from "@/lib/supabase/admin"

export type BankingRow = Record<string, unknown>

/**
 * Some projects name this table "banking_accounts" or "bank_accounts".
 * Your error logs suggest "bank_entries" exists instead.
 * We try a small cascade so pages don't crash even if a name differs.
 */
const BANK_TABLE_CANDIDATES = ["banking_accounts", "bank_accounts", "bank_entries"]

async function selectFirstAvailable<T = BankingRow>(limit = 1000) {
  const supabase = getAdminClient()
  let lastError: unknown = null

  for (const table of BANK_TABLE_CANDIDATES) {
    const { data, error } = await supabase.from(table).select("*").limit(limit)
    if (!error) return { table, rows: (data ?? []) as T[] }
    lastError = error
    // Continue to next candidate
  }

  console.error("Database Error (banking tables):", lastError)
  return { table: null as unknown as string, rows: [] as T[] }
}

async function selectByIdFirstAvailable<T = BankingRow>(id: string) {
  const supabase = getAdminClient()
  let lastError: unknown = null

  for (const table of BANK_TABLE_CANDIDATES) {
    const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle()
    if (!error) return { table, row: (data as T) ?? null }
    lastError = error
  }

  console.error("Database Error (banking by id):", lastError)
  return { table: null as unknown as string, row: null as T | null }
}

export async function fetchBankingAccounts(): Promise<BankingRow[]> {
  const { rows } = await selectFirstAvailable<BankingRow>()
  return rows
}

export async function fetchBankingAccountById(id: string): Promise<BankingRow | null> {
  const { row } = await selectByIdFirstAvailable<BankingRow>(id)
  return row
}
