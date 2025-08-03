import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { getPurchases } from "@/lib/data/purchases"
import PurchaseList from "@/components/purchases/purchase-list"

export default async function PurchasesPage() {
  const purchases = await getPurchases()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Achats</h1>
        <Button asChild>
          <Link href="/purchases/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Enregistrer un achat
          </Link>
        </Button>
      </div>
      <PurchaseList purchases={purchases} />
    </div>
  )
}
