import { notFound } from "next/navigation"
import { getSupplierById } from "@/lib/data/suppliers"
import { SupplierForm } from "@/components/suppliers/supplier-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function EditSupplierPage({ params }: { params: { id: string } }) {
  const id = params.id
  const supplier = await getSupplierById(id)

  if (!supplier) {
    notFound()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Supplier</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierForm initialData={supplier} />
        </CardContent>
      </Card>
    </div>
  )
}
