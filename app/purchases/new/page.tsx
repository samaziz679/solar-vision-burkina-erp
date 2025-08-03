import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PurchaseForm } from "@/components/purchases/purchase-form"
import { getProducts } from "@/lib/data/products"
import { getSuppliers } from "@/lib/data/suppliers"

export default async function NewPurchasePage() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/login")
  }

  const products = await getProducts(data.user.id)
  const suppliers = await getSuppliers(data.user.id)

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center">Add New Purchase</h1>
        <PurchaseForm products={products} suppliers={suppliers} />
      </div>
    </div>
  )
}
