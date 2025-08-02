import SupplierForm from "@/components/suppliers/supplier-form"

export default function NewSupplierPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Nouveau Fournisseur</h1>
      <SupplierForm />
    </div>
  )
}
