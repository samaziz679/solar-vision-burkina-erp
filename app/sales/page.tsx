import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { getSales } from "@/lib/data/sales" // Import the new data function
import SalesList from "@/components/sales/sales-list" // Import the new component

export default async function SalesPage() {
  const sales = await getSales() // Fetch sales data

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
      <SalesList sales={sales} /> {/* Pass sales data to SalesList */}
    </div>
  )
}
