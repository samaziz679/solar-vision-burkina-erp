import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProductList } from "@/components/inventory/product-list"
import { getProducts } from "@/lib/data/products"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function InventoryPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const products = await getProducts(user.id)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Inventory</CardTitle>
        <Button asChild>
          <Link href="/inventory/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ProductList products={products} />
      </CardContent>
    </Card>
  )
}
