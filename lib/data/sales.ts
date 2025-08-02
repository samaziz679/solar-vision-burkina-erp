import { createServerClient } from "@/lib/supabase/server"
import type { Sale } from "@/lib/supabase/types"

// Extend Sale type to include joined product and client names for display
export type SaleWithDetails = Sale & {
  products: {
    id: string
    name: string
    type: string | null
    quantity: number
    prix_vente_detail_1: number
    prix_vente_detail_2: number
    prix_vente_gros: number
  } | null
  clients: { id: string; name: string } | null
}

export async function getSales(): Promise<SaleWithDetails[]> {
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
    .order("sale_date", { ascending: false })

  if (error) {
    console.error("Error fetching sales:", error.message)
    return []
  }

  return data as SaleWithDetails[]
}

export async function getSaleById(id: string): Promise<SaleWithDetails | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("sales")
    .select(
      `
      *,
      products (id, name, type, quantity, prix_vente_detail_1, prix_vente_detail_2, prix_vente_gros),
      clients (id, name)
    `,
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching sale with ID ${id}:`, error.message)
    return null
  }

  return data as SaleWithDetails
}
