export const dynamic = "force-dynamic"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SupplierForm from "@/components/suppliers/supplier-form"
import { createSupplier } from "@/app/suppliers/actions"

export default function NewSupplierPage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter un nouveau fournisseur</CardTitle>
          <CardDescription>Remplissez les détails du nouveau fournisseur.</CardDescription>
        </CardHeader>
        <CardContent>
          <SupplierForm action={createSupplier} />
        </CardContent>
      </Card>
    </div>
  )
}
