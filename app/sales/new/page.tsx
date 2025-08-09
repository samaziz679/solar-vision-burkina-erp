import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SaleForm } from "@/components/sales/sale-form"
import { getClients } from "@/lib/data/clients"
import { getProducts } from "@/lib/data/products"
import { requireAuth } from "@/lib/auth"

export default async function NewSalePage() {
  await requireAuth()
  const clients = await getClients()
  const products = await getProducts()

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Sale</CardTitle>
        <CardDescription>Fill in the details for the new sale.</CardDescription>
      </CardHeader>
      <CardContent>
        <SaleForm clients={clients} products={products} />
      </CardContent>
    </Card>
  )
}
