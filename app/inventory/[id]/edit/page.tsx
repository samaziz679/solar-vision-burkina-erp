import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { getProductById } from "@/lib/data/products"
import { updateProduct } from "@/app/inventory/actions"

const ProductForm = dynamic(() => import("@/components/inventory/product-form"), {
  ssr: false,
  loading: () => <div>Chargement du formulaire...</div>,
})

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    return (
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Produit Introuvable</CardTitle>
            <CardDescription>Le produit que vous essayez de modifier n'existe pas.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Modifier le produit</CardTitle>
          <CardDescription>Mettez à jour les détails du produit.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm action={updateProduct} initialData={product} />
        </CardContent>
      </Card>
    </div>
  )
}
