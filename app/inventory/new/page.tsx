import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "@/components/inventory/product-form"
import { getSuppliers } from "@/lib/data/suppliers"
import { requireAuth } from "@/lib/auth"

export default async function NewProductPage() {
  await requireAuth()
  const suppliers = await getSuppliers()

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Product</CardTitle>
        <CardDescription>Fill in the details for the new product.</CardDescription>
      </CardHeader>
      <CardContent>
        <ProductForm suppliers={suppliers} />
      </CardContent>
    </Card>
  )
}
