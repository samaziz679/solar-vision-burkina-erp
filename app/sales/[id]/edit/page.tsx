import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSaleById } from "@/lib/data/sales"
import { EditSaleForm } from "@/components/sales/edit-sale-form"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getClients } from "@/lib/data/clients"
import { getProducts } from "@/lib/data/products"

export default async function EditSalePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const sale = await getSaleById(params.id, user.id)
  const clients = await getClients(user.id)
  const products = await getProducts(user.id)

  if (!sale) {
    notFound()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Sale</CardTitle>
      </CardHeader>
      <CardContent>
        <EditSaleForm initialData={sale} clients={clients} products={products} />
      </CardContent>
    </Card>
  )
}
