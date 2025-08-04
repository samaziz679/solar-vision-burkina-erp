import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProductById } from "@/lib/data/products"
import { EditProductForm } from "@/components/inventory/edit-product-form"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const product = await getProductById(params.id, user.id)

  if (!product) {
    notFound()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
      </CardHeader>
      <CardContent>
        <EditProductForm initialData={product} />
      </CardContent>
    </Card>
  )
}
