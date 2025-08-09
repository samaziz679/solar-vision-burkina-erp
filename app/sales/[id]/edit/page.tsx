import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EditSaleForm } from "@/components/sales/edit-sale-form"
import { getSaleById } from "@/lib/data/sales"
import { getClients } from "@/lib/data/clients"
import { getProducts } from "@/lib/data/products"
import { notFound } from "next/navigation"
import { requireAuth } from "@/lib/auth"

type EditSalePageProps = {
  params: { id: string }
}

export default async function EditSalePage({ params }: EditSalePageProps) {
  await requireAuth()
  const sale = await getSaleById(params.id)
  const clients = await getClients()
  const products = await getProducts()

  if (!sale) {
    notFound()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Sale</CardTitle>
        <CardDescription>Update the details for this sale.</CardDescription>
      </CardHeader>
      <CardContent>
        <EditSaleForm initialData={sale} clients={clients} products={products} />
      </CardContent>
    </Card>
  )
}
