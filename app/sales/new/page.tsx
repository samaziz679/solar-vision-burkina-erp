import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SaleForm from "@/components/sales/sale-form"
import { createSale } from "@/app/sales/actions"
import { getProducts } from "@/lib/data/products"
import { getClients } from "@/lib/data/clients"

export default async function NewSalePage() {
  const products = await getProducts()
  const clients = await getClients()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter une nouvelle vente</CardTitle>
          <CardDescription>Remplissez les détails de la nouvelle vente.</CardDescription>
        </CardHeader>
        <CardContent>
          <SaleForm action={createSale} products={products} clients={clients} />
        </CardContent>
      </Card>
    </div>
  )
}
