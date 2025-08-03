import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProductForm from "@/components/inventory/product-form"
import { createProduct } from "@/app/inventory/actions"

export default function NewProductPage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter un nouveau produit</CardTitle>
          <CardDescription>Remplissez les détails du nouveau produit.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm action={createProduct} />
        </CardContent>
      </Card>
    </div>
  )
}
