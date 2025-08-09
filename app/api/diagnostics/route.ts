import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const supabase = getAdminClient()

  async function probe(table: string) {
    try {
      const { data, error } = await supabase
        .from(table as any)
        .select("*")
        .limit(1)
      if (error) {
        return { ok: false, error: { code: error.code, message: error.message, hint: error.hint } }
      }
      return { ok: true, sample: (data && data[0]) ?? null }
    } catch (err: any) {
      return {
        ok: false,
        error: { code: err?.code ?? "UNKNOWN", message: String(err?.message ?? err) },
      }
    }
  }

  const env = {
    SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  }

  const checks = {
    banking_accounts: await probe("banking_accounts"),
    bank_accounts: await probe("bank_accounts"),
    bank_entries: await probe("bank_entries"),
    expenses: await probe("expenses"),
    purchases: await probe("purchases"),
    sales: await probe("sales"),
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    env,
    checks,
  })
}
