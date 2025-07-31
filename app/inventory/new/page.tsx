import ProductForm from "@/components/inventory/product-form"

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Nouveau Produit</h1>
      <ProductForm />
    </div>
  )
}

