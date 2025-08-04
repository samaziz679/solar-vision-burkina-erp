import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EditSaleForm } from "@/components/sales/edit-sale-form"
import { getSaleById } from "@/lib/data/sales"
import { getClients } from "@/lib/data/clients"
import { getProducts } from "@/lib/data/products"

export default async function EditSalePage({
  params,
}: {
  params: { id: string }
}) {
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
    redirect("/sales")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Edit Sale</h2>
        <EditSaleForm initialData={sale} clients={clients} products={products} />
      </div>
    </div>
  )
}
