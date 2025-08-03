import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PurchaseForm from "@/components/purchases/purchase-form"
import { addPurchase } from "@/app/purchases/actions"
import { getProducts } from "@/lib/data/products"
import { getSuppliers } from "@/lib/data/suppliers"

export const dynamic = "force-dynamic"

export default async function NewPurchasePage() {
  const products = await getProducts()
  const suppliers = await getSuppliers()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Enregistrer un nouvel achat</CardTitle>
          <CardDescription>Remplissez les détails du nouvel achat.</CardDescription>
        </CardHeader>
        <CardContent>
          <PurchaseForm action={addPurchase} products={products} suppliers={suppliers} />
        </CardContent>
      </Card>
    </div>
  )
}
