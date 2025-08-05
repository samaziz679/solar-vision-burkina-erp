import { getProducts } from "@/lib/data/products"
import { ProductList } from "@/components/inventory/product-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function InventoryPage() {
  const products = await getProducts()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Inventory</CardTitle>
          <Link href="/inventory/new">
            <Button>Add New Product</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <ProductList products={products} />
        </CardContent>
      </Card>
    </div>
  )
}
