import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SupplierForm } from "@/components/suppliers/supplier-form"
import { requireAuth } from "@/lib/auth"

export default async function NewSupplierPage() {
  await requireAuth()

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Supplier</CardTitle>
        <CardDescription>Fill in the details for the new supplier.</CardDescription>
      </CardHeader>
      <CardContent>
        <SupplierForm />
      </CardContent>
    </Card>
  )
}
