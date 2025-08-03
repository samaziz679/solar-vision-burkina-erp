import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PurchaseForm from "@/components/purchases/purchase-form"
import { createPurchase } from "@/app/purchases/actions"
import { getProducts } from "@/lib/data/products"
import { getSuppliers } from "@/lib/data/suppliers"

export default async function NewPurchasePage() {
  const products = await getProducts()
  const suppliers = await getSuppliers()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter un nouvel achat</CardTitle>
          <CardDescription>Remplissez les détails du nouvel achat.</CardDescription>
        </CardHeader>
        <CardContent>
          <PurchaseForm action={createPurchase} products={products} suppliers={suppliers} />
        </CardContent>
      </Card>
    </div>
  )
}
