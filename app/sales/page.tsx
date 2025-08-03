import { Suspense } from "react"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SalesList, { SalesListSkeleton } from "@/components/sales/sales-list"
import { getSales } from "@/lib/data/sales"

export const dynamic = "force-dynamic"

export default async function SalesPage() {
  const sales = await getSales()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Ventes</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/sales/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Enregistrer une vente
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Historique des Ventes</CardTitle>
          <CardDescription>Gérez vos enregistrements de ventes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<SalesListSkeleton />}>
            <SalesList sales={sales} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
