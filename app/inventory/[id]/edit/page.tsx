import { notFound } from "next/navigation"
import { getProductById } from "@/lib/data/products"
import { EditProductForm } from "@/components/inventory/edit-product-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const id = params.id
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <EditProductForm initialData={product} />
        </CardContent>
      </Card>
    </div>
  )
}
