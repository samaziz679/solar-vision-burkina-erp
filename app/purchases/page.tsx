import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { PurchaseList } from "@/components/purchases/purchase-list"
import { getPurchases } from "@/lib/data/purchases"
import { getSuppliers } from "@/lib/data/suppliers"
import { requireAuth } from "@/lib/auth"

export default async function PurchasesPage() {
  await requireAuth()
  const purchases = await getPurchases()
  const suppliers = await getSuppliers()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Purchases</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/purchases/new">
              <PlusCircle className="h-3.5 w-3.5 mr-2" />
              Add New Purchase
            </Link>
          </Button>
        </div>
      </div>
      <PurchaseList purchases={purchases} suppliers={suppliers} />
    </div>
  )
}
