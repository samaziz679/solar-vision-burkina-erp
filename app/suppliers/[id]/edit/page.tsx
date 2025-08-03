import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SupplierForm } from "@/components/suppliers/supplier-form"
import { getSupplierById } from "@/lib/data/suppliers"

export default async function EditSupplierPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const supplier = await getSupplierById(params.id, user.id)

  if (!supplier) {
    redirect("/suppliers")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Edit Supplier</h2>
        <SupplierForm initialData={supplier} />
      </div>
    </div>
  )
}
