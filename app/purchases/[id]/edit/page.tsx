import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PurchaseForm } from "@/components/purchases/purchase-form"
import { getPurchaseById } from "@/lib/data/purchases"
import { getProducts } from "@/lib/data/products"
import { getSuppliers } from "@/lib/data/suppliers"

export default async function EditPurchasePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/login")
  }

  const purchase = await getPurchaseById(params.id, data.user.id)
  const products = await getProducts(data.user.id)
  const suppliers = await getSuppliers(data.user.id)

  if (!purchase) {
    redirect("/purchases")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center">Edit Purchase</h1>
        <PurchaseForm initialData={purchase} products={products} suppliers={suppliers} />
      </div>
    </div>
  )
}
