import { getPurchases } from "@/lib/data/purchases"
import { PurchaseList } from "@/components/purchases/purchase-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function PurchasesPage() {
  const purchases = await getPurchases()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Purchases</CardTitle>
          <Link href="/purchases/new">
            <Button>Add New Purchase</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <PurchaseList purchases={purchases} />
        </CardContent>
      </Card>
    </div>
  )
}
