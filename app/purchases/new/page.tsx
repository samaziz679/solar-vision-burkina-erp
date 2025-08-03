import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PurchaseForm } from "@/components/purchases/purchase-form"
import { getProducts } from "@/lib/data/products"
import { getSuppliers } from "@/lib/data/suppliers"

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Add New Purchase</h2>
        <PurchaseForm products={products} suppliers={suppliers} />
      </div>
    </div>
  )
}
