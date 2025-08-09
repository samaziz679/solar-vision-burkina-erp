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
import SaleForm from "@/components/sales/sale-form"
import { getAdminClient } from "@/lib/supabase/admin"
import { fetchClients } from "@/lib/data/clients"
import type { SearchParams } from "@/lib/utils/safe-params"

// Match exactly what the SaleForm expects for products
type ProductForSale = {
  id: string
  name: string
  prix_vente_detail_1: number | null
  prix_vente_detail_2: number | null
  prix_vente_gros: number | null
}

type ClientOption = { id: string; name: string | null }

export default async function NewSalePage({
  searchParams,
}: {
  searchParams?: SearchParams
}) {
  // Cookie-free SSR read
  const supabase = getAdminClient()

  const [{ data: productsData, error: productsError }, fullClients] = await Promise.all([
    supabase
      .from("products")
      .select("id,name,prix_vente_detail_1,prix_vente_detail_2,prix_vente_gros")
      .order("name", { ascending: true }),
    fetchClients(),
  ])

  if (productsError) {
    console.error("Failed to load products for /sales/new:", productsError)
    throw new Error("Unable to load products.")
  }

  const products: ProductForSale[] = (productsData ?? []).map((p: any) => ({
    id: String(p.id),
    name: String(p.name ?? ""),
    prix_vente_detail_1: p.prix_vente_detail_1 != null ? Number(p.prix_vente_detail_1) : null,
    prix_vente_detail_2: p.prix_vente_detail_2 != null ? Number(p.prix_vente_detail_2) : null,
    prix_vente_gros: p.prix_vente_gros != null ? Number(p.prix_vente_gros) : null,
  }))

  const clients: ClientOption[] = (fullClients ?? []).map((c: any) => ({
    id: String(c.id),
    name: c.name ?? null,
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
          {/* The types align with SaleForm's props: products: { id, name, prix_* }[], clients: { id, name }[] */}
          <SaleForm products={products} clients={clients as any} />
        </CardContent>
      </Card>
    </main>
  )
}
