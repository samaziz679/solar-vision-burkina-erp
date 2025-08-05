import { PurchaseForm } from "@/components/purchases/purchase-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProducts } from "@/lib/data/products"
import { getSuppliers } from "@/lib/data/suppliers"

export default async function NewPurchasePage() {
  const products = await getProducts()
  const suppliers = await getSuppliers()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Add New Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <PurchaseForm products={products} suppliers={suppliers} />
        </CardContent>
      </Card>
    </div>
  )
}
