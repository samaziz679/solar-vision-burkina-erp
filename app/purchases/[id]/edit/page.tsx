import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import EditPurchaseForm from "@/components/purchases/edit-purchase-form"
import { getPurchaseById } from "@/lib/data/purchases"
import { getProducts } from "@/lib/data/products"
import { getSuppliers } from "@/lib/data/suppliers"

export default async function EditPurchasePage({ params }: { params: { id: string } }) {
  const purchase = await getPurchaseById(params.id)
  const products = await getProducts()
  const suppliers = await getSuppliers()

  if (!purchase) {
    notFound()
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Modifier l'achat</CardTitle>
          <CardDescription>Mettez à jour les détails de l'achat.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditPurchaseForm initialData={purchase} products={products} suppliers={suppliers} />
        </CardContent>
      </Card>
    </div>
  )
}
