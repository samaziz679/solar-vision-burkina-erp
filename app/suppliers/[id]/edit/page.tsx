import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import EditSupplierForm from "@/components/suppliers/edit-supplier-form"
import { getSupplierById } from "@/lib/data/suppliers"
import { updateSupplier } from "@/app/suppliers/actions"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EditSupplierPage({ params }: { params: { id: string } }) {
  const supplier = await getSupplierById(params.id)

  if (!supplier) {
    notFound()
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Modifier le fournisseur</CardTitle>
          <CardDescription>Mettez à jour les détails du fournisseur.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditSupplierForm initialData={supplier} action={updateSupplier} />
        </CardContent>
      </Card>
    </div>
  )
}
