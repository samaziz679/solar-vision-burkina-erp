import { getSupplierById } from "@/lib/data/suppliers"
import { SupplierForm } from "./supplier-form"

interface EditSupplierFormProps {
  supplierId: string
}

export async function EditSupplierForm({ supplierId }: EditSupplierFormProps) {
  const { data: supplier, error } = await getSupplierById(supplierId)

  if (error) {
    return <div className="text-red-500">Error loading supplier: {error.message}</div>
  }

  if (!supplier) {
    return <div className="text-red-500">Supplier not found.</div>
  }

  return <SupplierForm defaultValues={supplier} />
}
