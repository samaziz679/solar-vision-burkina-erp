import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SupplierForm } from "@/components/suppliers/supplier-form"
import { getSupplierById } from "@/lib/data/suppliers"
import { notFound } from "next/navigation"
import { requireAuth } from "@/lib/auth"

type EditSupplierPageProps = {
  params: { id: string }
}

export default async function EditSupplierPage({ params }: EditSupplierPageProps) {
  await requireAuth()
  const supplier = await getSupplierById(params.id)

  if (!supplier) {
    notFound()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Supplier</CardTitle>
        <CardDescription>Update the details for this supplier.</CardDescription>
      </CardHeader>
      <CardContent>
        <SupplierForm initialData={supplier} />
      </CardContent>
    </Card>
  )
}
