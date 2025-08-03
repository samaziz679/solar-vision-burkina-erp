import { Suspense } from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SupplierList, { SupplierListSkeleton } from "@/components/suppliers/supplier-list"
import { getSuppliers } from "@/lib/data/suppliers"

export default async function SuppliersPage() {
  const suppliers = await getSuppliers()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Fournisseurs</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/suppliers/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un fournisseur
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Fournisseurs</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<SupplierListSkeleton />}>
            <SupplierList suppliers={suppliers} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
