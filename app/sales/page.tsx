import { getSales } from "@/lib/data/sales"
import { SalesList } from "@/components/sales/sales-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SalesPage() {
  const sales = await getSales()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Sales</CardTitle>
          <Link href="/sales/new">
            <Button>Add New Sale</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <SalesList sales={sales} />
        </CardContent>
      </Card>
    </div>
  )
}
