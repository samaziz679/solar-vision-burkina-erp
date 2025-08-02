import { getSupplierById } from "@/lib/data/suppliers"
import SupplierForm from "@/components/suppliers/supplier-form"
import { notFound } from "next/navigation"

interface EditSupplierPageProps {
  params: {
    id: string
  }
}

export default async function EditSupplierPage({ params }: EditSupplierPageProps) {
  const supplier = await getSupplierById(params.id)

  if (!supplier) {
    notFound() // Show 404 if supplier not found
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Modifier Fournisseur: {supplier.name}</h1>
      <SupplierForm supplier={supplier} />
    </div>
  )
}

