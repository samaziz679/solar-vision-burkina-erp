"use client"
import { getPurchaseById } from "@/lib/data/purchases"
import { getProducts } from "@/lib/data/products"
import { getSuppliers } from "@/lib/data/suppliers"
import { PurchaseForm } from "./purchase-form"

interface EditPurchaseFormProps {
  purchaseId: string
}

export async function EditPurchaseForm({ purchaseId }: EditPurchaseFormProps) {
  const { data: purchase, error: purchaseError } = await getPurchaseById(purchaseId)
  const { data: products, error: productsError } = await getProducts()
  const { data: suppliers, error: suppliersError } = await getSuppliers()

  if (purchaseError) {
    return <div className="text-red-500">Error loading purchase: {purchaseError.message}</div>
  }
  if (productsError) {
    return <div className="text-red-500">Error loading products: {productsError.message}</div>
  }
  if (suppliersError) {
    return <div className="text-red-500">Error loading suppliers: {suppliersError.message}</div>
  }

  if (!purchase) {
    return <div className="text-red-500">Purchase not found.</div>
  }
  if (!products || !suppliers) {
    return <div className="text-red-500">Failed to load necessary data for purchase form.</div>
  }

  return <PurchaseForm defaultValues={purchase} products={products} suppliers={suppliers} />
}
