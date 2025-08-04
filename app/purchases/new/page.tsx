import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PurchaseForm } from "@/components/purchases/purchase-form"
import { getProducts } from "@/lib/data/products"
import { getSuppliers } from "@/lib/data/suppliers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function NewPurchasePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const products = await getProducts(user.id)
  const suppliers = await getSuppliers(user.id)

  if (products.length === 0 || suppliers.length === 0) {
    redirect("/setup-required?message=Please add at least one product and one supplier before creating purchases.")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Purchase</CardTitle>
      </CardHeader>
      <CardContent>
        <PurchaseForm products={products} suppliers={suppliers} />
      </CardContent>
    </Card>
  )
}
