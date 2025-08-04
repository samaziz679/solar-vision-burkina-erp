import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SaleForm } from "@/components/sales/sale-form"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getClients } from "@/lib/data/clients"
import { getProducts } from "@/lib/data/products"

export default async function NewSalePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const clients = await getClients(user.id)
  const products = await getProducts(user.id)

  if (clients.length === 0 || products.length === 0) {
    redirect("/setup-required?message=Please add at least one client and one product before creating sales.")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Sale</CardTitle>
      </CardHeader>
      <CardContent>
        <SaleForm clients={clients} products={products} />
      </CardContent>
    </Card>
  )
}
