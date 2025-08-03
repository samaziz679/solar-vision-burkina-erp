import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import EditSaleForm from "@/components/sales/edit-sale-form"
import { getSaleById } from "@/lib/data/sales"
import { updateSale } from "@/app/sales/actions"
import { getProducts } from "@/lib/data/products"
import { getClients } from "@/lib/data/clients"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EditSalePage({ params }: { params: { id: string } }) {
  const sale = await getSaleById(params.id)
  const products = await getProducts()
  const clients = await getClients()

  if (!sale) {
    notFound()
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Modifier la vente</CardTitle>
          <CardDescription>Mettez à jour les détails de la vente.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditSaleForm initialData={sale} products={products} clients={clients} action={updateSale} />
        </CardContent>
      </Card>
    </div>
  )
}
