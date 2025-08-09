import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { ProductList } from "@/components/inventory/product-list"
import { getProducts } from "@/lib/data/products"
import { getSuppliers } from "@/lib/data/suppliers"
import { requireAuth } from "@/lib/auth"

export default async function InventoryPage() {
  await requireAuth()
  const products = await getProducts()
  const suppliers = await getSuppliers()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Inventory</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/inventory/new">
              <PlusCircle className="h-3.5 w-3.5 mr-2" />
              Add New Product
            </Link>
          </Button>
        </div>
      </div>
      <ProductList products={products} suppliers={suppliers} />
    </div>
  )
}
