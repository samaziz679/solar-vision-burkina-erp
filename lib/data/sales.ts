import { createServerClient } from "@/lib/supabase/server"
import type { Sale } from "@/lib/supabase/types"

export async function getSales(): Promise<Sale[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("sales")
    .select(
      `
      *,
      products (name, type),
      clients (name)
    `,
    )
    .order("sale_date", { ascending: false }) // Order by most recent sales

  if (error) {
    console.error("Error fetching sales:", error.message)
    return []
  }

  // Type casting to include joined table data
  return data as (Sale & { products: { name: string; type: string | null } | null; clients: { name: string } | null })[]
}
