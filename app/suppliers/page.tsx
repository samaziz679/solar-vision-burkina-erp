import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { getSuppliers } from "@/lib/data/suppliers" // Import the new data function
import SupplierList from "@/components/suppliers/supplier-list" // Will be created next

export default async function SuppliersPage() {
  const suppliers = await getSuppliers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Fournisseurs</h1>
        <Button asChild>
          <Link href="/suppliers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un fournisseur
          </Link>
        </Button>
      </div>
      <SupplierList suppliers={suppliers} />
    </div>
  )
}
