import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SupplierList } from "@/components/suppliers/supplier-list"
import { getSuppliers } from "@/lib/data/suppliers"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SuppliersPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const suppliers = await getSuppliers(user.id)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Suppliers</CardTitle>
        <Button asChild>
          <Link href="/suppliers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Supplier
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <SupplierList suppliers={suppliers} />
      </CardContent>
    </Card>
  )
}
