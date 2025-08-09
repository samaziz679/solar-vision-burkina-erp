import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PurchaseForm } from "@/components/purchases/purchase-form"
import { getSuppliers } from "@/lib/data/suppliers"
import { getProducts } from "@/lib/data/products"
import { requireAuth } from "@/lib/auth"

export default async function NewPurchasePage() {
  await requireAuth()
  const suppliers = await getSuppliers()
  const products = await getProducts()

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Purchase</CardTitle>
        <CardDescription>Fill in the details for the new purchase.</CardDescription>
      </CardHeader>
      <CardContent>
        <PurchaseForm suppliers={suppliers} products={products} />
      </CardContent>
    </Card>
  )
}
