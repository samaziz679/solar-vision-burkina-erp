import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { getProducts } from "@/lib/data/products"
import ProductList from "@/components/inventory/product-list"

export default async function InventoryPage() {
  const products = await getProducts()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Inventaire</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/inventory/new">
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Produits</CardTitle>
          <CardDescription>Gérez vos produits et leur stock.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductList products={products} />
        </CardContent>
      </Card>
    </div>
  )
}
