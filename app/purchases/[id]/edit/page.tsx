import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EditPurchaseForm } from "@/components/purchases/edit-purchase-form"
import { getPurchaseById } from "@/lib/data/purchases"
import { getProducts } from "@/lib/data/products"
import { getSuppliers } from "@/lib/data/suppliers"

export default async function EditPurchasePage({
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

  const purchase = await getPurchaseById(params.id, user.id)
  const products = await getProducts(user.id)
  const suppliers = await getSuppliers(user.id)

  if (!purchase) {
    redirect("/purchases")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Edit Purchase</h2>
        <EditPurchaseForm initialData={purchase} products={products} suppliers={suppliers} />
      </div>
    </div>
  )
}
