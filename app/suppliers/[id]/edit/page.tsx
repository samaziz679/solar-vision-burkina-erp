import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SupplierForm } from "@/components/suppliers/supplier-form"
import { getSupplierById } from "@/lib/data/suppliers"

export default async function EditSupplierPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/login")
  }

  const supplier = await getSupplierById(params.id, data.user.id)

  if (!supplier) {
    redirect("/suppliers")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center">Edit Supplier</h1>
        <SupplierForm initialData={supplier} />
      </div>
    </div>
  )
}
