import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SalesList } from "@/components/sales/sales-list"
import { getSales } from "@/lib/data/sales"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SalesPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const sales = await getSales(user.id)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Sales</CardTitle>
        <Button asChild>
          <Link href="/sales/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Sale
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <SalesList sales={sales} />
      </CardContent>
    </Card>
  )
}
