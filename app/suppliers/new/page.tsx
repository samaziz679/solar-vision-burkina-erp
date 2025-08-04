import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SupplierForm } from "@/components/suppliers/supplier-form"

export default function NewSupplierPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Supplier</CardTitle>
      </CardHeader>
      <CardContent>
        <SupplierForm />
      </CardContent>
    </Card>
  )
}
