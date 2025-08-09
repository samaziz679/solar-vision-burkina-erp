import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EditProductForm } from "@/components/inventory/edit-product-form"
import { getProductById } from "@/lib/data/products"
import { getSuppliers } from "@/lib/data/suppliers"
import { notFound } from "next/navigation"
import { requireAuth } from "@/lib/auth"

type EditProductPageProps = {
  params: { id: string }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  await requireAuth()
  const product = await getProductById(params.id)
  const suppliers = await getSuppliers()

  if (!product) {
    notFound()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
        <CardDescription>Update the details for this product.</CardDescription>
      </CardHeader>
      <CardContent>
        <EditProductForm initialData={product} suppliers={suppliers} />
      </CardContent>
    </Card>
  )
}
