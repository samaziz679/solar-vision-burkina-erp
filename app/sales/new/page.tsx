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
import { fetchClients } from "@/lib/data/clients"
import type { ComponentType } from "react"

// Import in a way that works whether the form exports named or default, and relax types to avoid TS friction.
import * as SaleFormNS from "@/components/sales/sale-form"
const SaleForm = (SaleFormNS.default ?? (SaleFormNS as any).SaleForm) as ComponentType<any>

// Shape needed by the form (pricing tiers from your schema)
export type ProductForSale = {
  id: string
  name: string
  prix_vente_detail_1: number | null
  prix_vente_detail_2: number | null
  prix_vente_gros: number | null
}

export default async function NewSalePage() {
  // Avoid searchParams.get in Server Components. Preload via admin client (no cookies).
  const supabase = getAdminClient()

  const [{ data: productsData, error: prodErr }, clients] = await Promise.all([
    supabase
      .from("products")
      .select("id,name,prix_vente_detail_1,prix_vente_detail_2,prix_vente_gros")
      .order("name", { ascending: true }),
    fetchClients(),
  ])

  if (prodErr) {
    console.error("sales/new preload products error:", prodErr)
    throw new Error("Failed to load products for the sale form.")
  }

  const products: ProductForSale[] =
    (productsData ?? []).map((p: any) => ({
      id: String(p.id),
      name: String(p.name ?? ""),
      prix_vente_detail_1: p.prix_vente_detail_1 != null ? Number(p.prix_vente_detail_1) : null,
      prix_vente_detail_2: p.prix_vente_detail_2 != null ? Number(p.prix_vente_detail_2) : null,
      prix_vente_gros: p.prix_vente_gros != null ? Number(p.prix_vente_gros) : null,
    })) ?? []

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
