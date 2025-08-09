import "server-only"
import { unstable_noStore as noStore } from "next/cache"
import { getAdminClient } from "@/lib/supabase/admin"
import type { Supplier } from "@/lib/supabase/types"

// Lightweight options for dropdowns (strictly existing fields)
export type SupplierLite = Pick<Supplier, "id" | "name">

/**
 * Fetch all suppliers (full rows, matches SQL schema).
 */
export async function fetchSuppliers(): Promise<Supplier[]> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("suppliers").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Database Error (fetchSuppliers):", error)
    throw new Error("Failed to fetch suppliers.")
  }

  return (data ?? []) as Supplier[]
}

/**
 * Fetch a single supplier by id (full row).
 */
export async function fetchSupplierById(id: string): Promise<Supplier | null> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("suppliers").select("*").eq("id", id).single()

  if (error) {
    console.error("Database Error (fetchSupplierById):", error)
    throw new Error("Failed to fetch supplier.")
  }

  return (data ?? null) as Supplier | null
}

/**
 * Supplier options for selects (id, name).
 */
export async function fetchSupplierOptions(): Promise<SupplierLite[]> {
  noStore()
  const supabase = getAdminClient()
  const { data, error } = await supabase.from("suppliers").select("id,name").order("name", { ascending: true })

  if (error) {
    console.error("Database Error (fetchSupplierOptions):", error)
    throw new Error("Failed to fetch supplier options.")
  }

  return (data ?? []) as SupplierLite[]
}
