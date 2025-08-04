import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSaleById } from "@/lib/data/sales"
import { getClients } from "@/lib/data/clients"
import { getProducts } from "@/lib/data/products"
import { EditSaleForm } from "@/components/sales/edit-sale-form"

export default async function EditSalePage({ params }: { params: { id: string } }) {
  const sale = await getSaleById(params.id)
  const clients = await getClients()
  const products = await getProducts()

  if (!sale) {
    notFound()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <EditSaleForm initialData={sale} clients={clients} products={products} />
        </CardContent>
      </Card>
    </div>
  )
}
