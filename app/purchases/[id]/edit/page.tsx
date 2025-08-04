import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPurchaseById } from "@/lib/data/purchases"
import { EditPurchaseForm } from "@/components/purchases/edit-purchase-form"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getSuppliers } from "@/lib/data/suppliers"
import { getProducts } from "@/lib/data/products"

export default async function EditPurchasePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const purchase = await getPurchaseById(params.id, user.id)
  const suppliers = await getSuppliers(user.id)
  const products = await getProducts(user.id)

  if (!purchase) {
    notFound()
  }

  if (suppliers.length === 0 || products.length === 0) {
    redirect("/setup-required?message=Please add at least one supplier and one product before editing purchases.")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Purchase</CardTitle>
      </CardHeader>
      <CardContent>
        <EditPurchaseForm initialData={purchase} suppliers={suppliers} products={products} />
      </CardContent>
    </Card>
  )
}
