import { getProductById } from "@/lib/data/products"
import EditProductForm from "@/components/inventory/edit-product-form"
import { notFound } from "next/navigation"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound() // Show 404 if product not found
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Modifier Produit: {product.name}</h1>
      <EditProductForm product={product} />
    </div>
  )
}

