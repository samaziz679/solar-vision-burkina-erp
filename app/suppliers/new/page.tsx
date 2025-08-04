import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SupplierForm } from "@/components/suppliers/supplier-form"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function NewSupplierPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Supplier</CardTitle>
      </CardHeader>
      <CardContent>
        <SupplierForm />
      </CardContent>
    </Card>
  )
}
