import { createServerClient } from "@/lib/supabase/server"
import type { Purchase } from "@/lib/supabase/types"

// Extend Purchase type to include joined product and supplier names for display
export type PurchaseWithDetails = Purchase & {
  products: {
    id: string
    name: string
    type: string | null
  } | null
  suppliers: { id: string; name: string } | null
}

export async function getPurchases(): Promise<PurchaseWithDetails[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("purchases")
    .select(
      `
      *,
      products (name, type),
      suppliers (name)
    `,
    )
    .order("purchase_date", { ascending: false })

  if (error) {
    console.error("Error fetching purchases:", error.message)
    return []
  }

  return data as PurchaseWithDetails[]
}

export async function getPurchaseById(id: string): Promise<PurchaseWithDetails | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("purchases")
    .select(
      `
      *,
      products (id, name, type),
      suppliers (id, name)
    `,
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching purchase with ID ${id}:`, error.message)
    return null
  }

  return data as PurchaseWithDetails
}
