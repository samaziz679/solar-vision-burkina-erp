import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import EditProductForm from "@/components/inventory/edit-product-form"
import { getProductById } from "@/lib/data/products"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Modifier le produit</CardTitle>
          <CardDescription>Mettez à jour les détails du produit.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditProductForm initialData={product} />
        </CardContent>
      </Card>
    </div>
  )
}
