import PurchaseForm from "@/components/purchases/purchase-form"
import { getProducts } from "@/lib/data/products"
import { getSuppliers } from "@/lib/data/suppliers"

export default async function NewPurchasePage() {
  const products = await getProducts()
  const suppliers = await getSuppliers()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Enregistrer un nouvel achat</h1>
      <PurchaseForm products={products} suppliers={suppliers} />
    </div>
  )
}
 
