import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

// Join clients and products so names render in the table
// Return a flexible row that SalesList already supports.
export type JoinedSaleRow = {
  id: string
  sale_date?: string | null
  quantity?: number | null
  total_amount?: number | null
  user_id?: string | null
  client_id?: string | null
  product_id?: string | null
  // joined names
  clients?: { id: string; name: string | null } | null
  products?: { id: string; name: string | null } | null
  client_name?: string | null
  product_name?: string | null
  created_at?: string | null
}

function getSupabase() {
  const cookieStore = cookies()
  const cookieMethods = {
    get(name: string) {
      return cookieStore.get(name)?.value
    },
    set(_name: string, _value: string, _options: CookieOptions) {},
    remove(_name: string, _options: CookieOptions) {},
  }
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: cookieMethods as any,
  })
}

export async function fetchSales(): Promise<JoinedSaleRow[]> {
  noStore()
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from("sales")
    .select(
      [
        "id",
        "sale_date",
        "quantity",
        "total_amount",
        "user_id",
        "client_id",
        "product_id",
        "clients(id,name)",
        "products(id,name)",
      ].join(","),
    )
    .order("id", { ascending: false })

  if (error) {
    console.error("Database Error (sales):", error)
    return []
  }

  const rows = (data ?? []).map((row: any) => ({
    ...row,
    // normalize numeric strings -> numbers for the UI currency formatter
    total_amount: row.total_amount != null ? Number(row.total_amount) : row.total != null ? Number(row.total) : null,
  })) as JoinedSaleRow[]

  return rows
}

export async function fetchSaleById(id: string): Promise<JoinedSaleRow | null> {
  noStore()
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from("sales")
    .select(
      [
        "id",
        "sale_date",
        "quantity",
        "total_amount",
        "user_id",
        "client_id",
        "product_id",
        "clients(id,name)",
        "products(id,name)",
      ].join(","),
    )
    .eq("id", id)
    .maybeSingle()

  if (error) {
    console.error("Database Error (sale by id):", error)
    return null
  }

  return data as JoinedSaleRow
}
