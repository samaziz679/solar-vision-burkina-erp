import { Suspense } from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProductList, { ProductListSkeleton } from "@/components/inventory/product-list"
import { getProducts } from "@/lib/data/products"

export default async function InventoryPage() {
  const products = await getProducts()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Inventaire</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/inventory/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Produits</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList products={products} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
