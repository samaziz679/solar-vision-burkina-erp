import { fetchSaleById } from "@/lib/data/sales"
import { EditSaleForm } from "@/components/sales/edit-sale-form"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"
import { fetchProductsForSaleForm } from "@/lib/data/products"
import { fetchClientsForSaleForm } from "@/lib/data/clients"

export default async function EditSalePage({ params }: { params: { id: string } }) {
  const id = params.id

  const [sale, products, clients] = await Promise.all([
    fetchSaleById(id),
    fetchProductsForSaleForm(),
    fetchClientsForSaleForm(),
  ])

  if (!sale) {
    notFound()
  }

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
            <BreadcrumbLink>Edit Sale</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Edit Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <EditSaleForm initialData={sale} products={products} clients={clients} />
        </CardContent>
      </Card>
    </main>
  )
}
