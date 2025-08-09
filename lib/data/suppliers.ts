import "server-only"
import { unstable_noStore as noStore } from "next/cache"
import { getAdminClient } from "@/lib/supabase/admin"
import type { Supplier } from "@/lib/supabase/types"

// Lightweight options for selects
export type SupplierLite = Pick<Supplier, "id" | "name">

/**
 * Full list of suppliers.
 */
export async function fetchSuppliers(): Promise<Supplier[]> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("suppliers").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database Error (suppliers):", error)
    throw new Error("Failed to fetch suppliers.")
  }

  return (data ?? []) as Supplier[]
}

/**
 * Supplier options (id, name) for dropdowns.
 */
export async function fetchSupplierOptions(): Promise<SupplierLite[]> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("suppliers").select("id,name").order("name", { ascending: true })

  if (error) {
    console.error("Database Error (supplier options):", error)
    throw new Error("Failed to fetch supplier options.")
  }

  return (data ?? []) as SupplierLite[]
}

/**
 * Single supplier by id.
 */
export async function fetchSupplierById(id: string): Promise<Supplier | null> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("suppliers").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error (supplier by id):", error)
    throw new Error("Failed to fetch supplier.")
  }

  return (data ?? null) as Supplier | null
}
