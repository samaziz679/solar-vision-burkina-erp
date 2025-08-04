import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupplierById } from "@/lib/data/suppliers"
import { SupplierForm } from "@/components/suppliers/supplier-form"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function EditSupplierPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const supplier = await getSupplierById(params.id, user.id)

  if (!supplier) {
    notFound()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Supplier</CardTitle>
      </CardHeader>
      <CardContent>
        <SupplierForm initialData={supplier} />
      </CardContent>
    </Card>
  )
}
