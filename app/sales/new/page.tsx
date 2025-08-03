import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SaleForm } from "@/components/sales/sale-form"
import { getProducts } from "@/lib/data/products"
import { getClients } from "@/lib/data/clients"

export default async function NewSalePage() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/login")
  }

  const products = await getProducts(data.user.id)
  const clients = await getClients(data.user.id)

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center">Add New Sale</h1>
        <SaleForm products={products} clients={clients} />
      </div>
    </div>
  )
}
