import { notFound } from "next/navigation"
import { getSaleById } from "@/lib/data/sales"
import { SaleForm } from "@/components/sales/sale-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProducts } from "@/lib/data/products"
import { getClients } from "@/lib/data/clients"

export default async function EditSalePage({ params }: { params: { id: string } }) {
  const id = params.id
  const sale = await getSaleById(id)
  const products = await getProducts()
  const clients = await getClients()

  if (!sale) {
    notFound()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <SaleForm initialData={sale} products={products} clients={clients} />
        </CardContent>
      </Card>
    </div>
  )
}
