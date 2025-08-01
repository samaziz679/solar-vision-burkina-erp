import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
// import { getSales } from "@/lib/data/sales" // Will be created later
// import SalesList from "@/components/sales/sales-list" // Will be created later

export default async function SalesPage() {
  // const sales = await getSales() // Uncomment when getSales is implemented

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Ventes</h1>
        <Button asChild>
          <Link href="/sales/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Enregistrer une vente
          </Link>
        </Button>
      </div>
      {/* <SalesList sales={sales} /> */} {/* Uncomment when SalesList is implemented */}
      <div className="text-center py-8 text-gray-500">
        <p>Liste des ventes à venir ici.</p>
        <p className="text-sm mt-1">Cliquez sur "Enregistrer une vente" pour commencer.</p>
      </div>
    </div>
  )
}

