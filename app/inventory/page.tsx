import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ProductList, { type InventoryProduct } from "@/components/inventory/product-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function InventoryPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data, error } = await supabase
    .from("products")
    .select("id,name,sku,price,stock_quantity,description,created_at,user_id")
    .order("created_at", { ascending: false })

  // Fall back to empty array on error
  const products = (data ?? []) as unknown as InventoryProduct[]

  return (
    <main className="flex-1 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductList products={products} />
        </CardContent>
      </Card>
    </main>
  )
}
