import { getPurchaseById } from "@/lib/data/purchases"
import { getProducts } from "@/lib/data/products"
import { getSuppliers } from "@/lib/data/suppliers"
import EditPurchaseForm from "@/components/purchases/edit-purchase-form"
import { notFound } from "next/navigation"

interface EditPurchasePageProps {
  params: {
    id: string
  }
}

export default async function EditPurchasePage({ params }: EditPurchasePageProps) {
  const purchase = await getPurchaseById(params.id)
  const products = await getProducts()
  const suppliers = await getSuppliers()

  if (!purchase) {
    notFound() // Show 404 if purchase not found
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Modifier Achat: {purchase.products?.name || "Achat Inconnu"}</h1>
      <EditPurchaseForm purchase={purchase} products={products} suppliers={suppliers} />
    </div>
  )
}
