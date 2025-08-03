import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { getSales } from "@/lib/data/sales"
import SalesList from "@/components/sales/sales-list"

export default async function SalesPage() {
  const sales = await getSales()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Ventes</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/sales/new">
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter une vente
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Ventes</CardTitle>
          <CardDescription>Gérez vos ventes aux clients.</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesList sales={sales} />
        </CardContent>
      </Card>
    </div>
  )
}
