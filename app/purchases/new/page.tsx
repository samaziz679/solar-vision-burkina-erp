import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PurchaseForm } from "@/components/purchases/purchase-form"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getSuppliers } from "@/lib/data/suppliers"
import { getProducts } from "@/lib/data/products"

export default async function NewPurchasePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const suppliers = await getSuppliers(user.id)
  const products = await getProducts(user.id)

  if (suppliers.length === 0 || products.length === 0) {
    redirect("/setup-required?message=Please add at least one supplier and one product before creating purchases.")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Purchase</CardTitle>
      </CardHeader>
      <CardContent>
        <PurchaseForm suppliers={suppliers} products={products} />
      </CardContent>
    </Card>
  )
}
