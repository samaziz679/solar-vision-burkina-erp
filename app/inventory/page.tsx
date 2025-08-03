import { getProducts } from "@/lib/data/products"
import ProductList from "@/components/inventory/product-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default async function InventoryPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Inventaire</h1>
        <Button asChild>
          <Link href="/inventory/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Link>
        </Button>
      </div>
      <ProductList products={products} />
    </div>
  )
}
