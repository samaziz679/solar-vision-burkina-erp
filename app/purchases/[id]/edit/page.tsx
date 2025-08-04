import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPurchaseById } from "@/lib/data/purchases"
import { EditPurchaseForm } from "@/components/purchases/edit-purchase-form"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProducts } from "@/lib/data/products"
import { getSuppliers } from "@/lib/data/suppliers"

export default async function EditPurchasePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const purchase = await getPurchaseById(params.id, user.id)
  const products = await getProducts(user.id)
  const suppliers = await getSuppliers(user.id)

  if (!purchase) {
    notFound()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Purchase</CardTitle>
      </CardHeader>
      <CardContent>
        <EditPurchaseForm initialData={purchase} products={products} suppliers={suppliers} />
      </CardContent>
    </Card>
  )
}
