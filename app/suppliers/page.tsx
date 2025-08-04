import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSuppliers } from "@/lib/data/suppliers"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { SupplierList } from "@/components/suppliers/supplier-list"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

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
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Button asChild>
          <Link href="/suppliers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Supplier
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierList suppliers={suppliers} />
        </CardContent>
      </Card>
    </div>
  )
}
