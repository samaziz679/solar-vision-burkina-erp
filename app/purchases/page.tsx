import { Suspense } from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PurchaseList, { PurchaseListSkeleton } from "@/components/purchases/purchase-list"
import { getPurchases } from "@/lib/data/purchases"

export default async function PurchasesPage() {
  const purchases = await getPurchases()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Achats</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/purchases/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un achat
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Achats</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<PurchaseListSkeleton />}>
            <PurchaseList purchases={purchases} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
