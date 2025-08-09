import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EditPurchaseForm } from "@/components/purchases/edit-purchase-form"
import { getPurchaseById } from "@/lib/data/purchases"
import { getSuppliers } from "@/lib/data/suppliers"
import { getProducts } from "@/lib/data/products"
import { notFound } from "next/navigation"
import { requireAuth } from "@/lib/auth"

type EditPurchasePageProps = {
  params: { id: string }
}

export default async function EditPurchasePage({ params }: EditPurchasePageProps) {
  await requireAuth()
  const purchase = await getPurchaseById(params.id)
  const suppliers = await getSuppliers()
  const products = await getProducts()

  if (!purchase) {
    notFound()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Purchase</CardTitle>
        <CardDescription>Update the details for this purchase.</CardDescription>
      </CardHeader>
      <CardContent>
        <EditPurchaseForm initialData={purchase} suppliers={suppliers} products={products} />
      </CardContent>
    </Card>
  )
}
