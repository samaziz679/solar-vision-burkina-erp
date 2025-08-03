import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { getPurchases } from "@/lib/data/purchases"
import PurchaseList from "@/components/purchases/purchase-list"

export default async function PurchasesPage() {
  const purchases = await getPurchases()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Achats</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/purchases/new">
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter un achat
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Achats</CardTitle>
          <CardDescription>Gérez vos achats auprès des fournisseurs.</CardDescription>
        </CardHeader>
        <CardContent>
          <PurchaseList purchases={purchases} />
        </CardContent>
      </Card>
    </div>
  )
}
