import { SaleForm } from "@/components/sales/sale-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProducts } from "@/lib/data/products"
import { getClients } from "@/lib/data/clients"

export default async function NewSalePage() {
  const products = await getProducts()
  const clients = await getClients()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Add New Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <SaleForm products={products} clients={clients} />
        </CardContent>
      </Card>
    </div>
  )
}
