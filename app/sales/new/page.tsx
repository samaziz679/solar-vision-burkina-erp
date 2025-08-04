import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SaleForm } from "@/components/sales/sale-form"
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Add New Sale</h2>
        <SaleForm clients={clients} products={products} />
      </div>
    </div>
  )
}
