import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { getSuppliers } from "@/lib/data/suppliers"
import SupplierList from "@/components/suppliers/supplier-list"

export default async function SuppliersPage() {
  const suppliers = await getSuppliers()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Fournisseurs</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/suppliers/new">
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter un fournisseur
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Fournisseurs</CardTitle>
          <CardDescription>Gérez vos fournisseurs et leurs informations.</CardDescription>
        </CardHeader>
        <CardContent>
          <SupplierList suppliers={suppliers} />
        </CardContent>
      </Card>
    </div>
  )
}
