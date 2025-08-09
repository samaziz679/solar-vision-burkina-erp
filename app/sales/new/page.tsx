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
import { fetchClientOptions } from "@/lib/data/clients"

type ProductForSale = {
  id: string
  name: string
  unit?: string | null
  quantity?: number | null
  prix_achat?: number | null
  prix_vente_detail_1?: number | null
  prix_vente_detail_2?: number | null
  prix_vente_gros?: number | null
}

export default async function NewSalePage() {
  // Server-side, cookie-free reads via admin client to avoid any cookies.get issues.
  const supabase = getAdminClient()

  // Fetch products with relevant fields for pricing/stock.
  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select("id,name,unit,quantity,prix_achat,prix_vente_detail_1,prix_vente_detail_2,prix_vente_gros")
    .order("name", { ascending: true })

  if (productsError) {
    console.error("Failed to load products:", productsError)
    throw new Error("Unable to load products.")
  }

  // Fetch clients as lightweight options for the dropdown.
  const clients = await fetchClientOptions()

  const products: ProductForSale[] = (productsData ?? []).map((p: any) => ({
    id: String(p.id),
    name: String(p.name ?? ""),
    unit: p.unit ?? null,
    quantity: typeof p.quantity === "number" ? p.quantity : null,
    prix_achat: p.prix_achat ?? null,
    prix_vente_detail_1: p.prix_vente_detail_1 ?? null,
    prix_vente_detail_2: p.prix_vente_detail_2 ?? null,
    prix_vente_gros: p.prix_vente_gros ?? null,
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
