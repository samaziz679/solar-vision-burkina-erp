import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getSuppliers } from "@/lib/data/suppliers"
import { SupplierList } from "@/components/suppliers/supplier-list"

export default async function SuppliersPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  const suppliers = await getSuppliers(user.id)

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Suppliers</h1>
      <SupplierList suppliers={suppliers} />
    </div>
  )
}
