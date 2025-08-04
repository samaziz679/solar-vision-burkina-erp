import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPurchaseById } from "@/lib/data/purchases"
import { getSuppliers } from "@/lib/data/suppliers"
import { getProducts } from "@/lib/data/products"
import { EditPurchaseForm } from "@/components/purchases/edit-purchase-form"

export default async function EditPurchasePage({ params }: { params: { id: string } }) {
  const purchase = await getPurchaseById(params.id)
  const suppliers = await getSuppliers()
  const products = await getProducts()

  if (!purchase) {
    notFound()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <EditPurchaseForm initialData={purchase} suppliers={suppliers} products={products} />
        </CardContent>
      </Card>
    </div>
  )
}
