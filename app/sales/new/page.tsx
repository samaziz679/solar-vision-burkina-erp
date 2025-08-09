export const dynamic = "force-dynamic"
export const revalidate = 0

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { getAdminClient } from "@/lib/supabase/admin"
import type { ComponentType } from "react"

// Flexible import (default or named) and relaxed props to avoid import-shape drift
import * as SaleFormNS from "@/components/sales/sale-form"
const SaleForm = (SaleFormNS.default ?? (SaleFormNS as any).SaleForm) as ComponentType<any>

type ProductForSale = {
  id: string
  name: string
  prix_vente_detail_1: number | null
  prix_vente_detail_2: number | null
  prix_vente_gros: number | null
}

export default async function NewSalePage() {
  const supabase = getAdminClient()

  // Fetch only real columns from your schema
  const [{ data: productsData, error: prodErr }, { data: clientsData, error: clientErr }] = await Promise.all([
    supabase
      .from("products")
      .select("id,name,prix_vente_detail_1,prix_vente_detail_2,prix_vente_gros")
      .order("name", { ascending: true }),
    // Pass full rows so SaleForm's typing is satisfied without guesswork
    supabase
      .from("clients")
      .select("*")
      .order("name", { ascending: true }),
  ])

  if (prodErr || clientErr) {
    console.error("sales/new preload error:", { prodErr, clientErr })
    throw new Error("Failed to load prerequisites for sale form.")
  }

  const products: ProductForSale[] =
    (productsData ?? []).map((p: any) => ({
      id: String(p.id),
      name: String(p.name ?? ""),
      prix_vente_detail_1: p?.prix_vente_detail_1 != null ? Number(p.prix_vente_detail_1) : null,
      prix_vente_detail_2: p?.prix_vente_detail_2 != null ? Number(p.prix_vente_detail_2) : null,
      prix_vente_gros: p?.prix_vente_gros != null ? Number(p.prix_vente_gros) : null,
    })) ?? []

  const clients = (clientsData ?? []).map((c: any) => ({
    ...c,
    id: String(c.id),
    name: String(c.name ?? ""),
  }))

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/sales">Sales</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>New Sale</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Add New Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <SaleForm products={products} clients={clients} />
        </CardContent>
      </Card>
    </main>
  )
}
