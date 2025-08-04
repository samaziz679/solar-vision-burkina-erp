import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSales } from "@/lib/data/sales"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { SalesList } from "@/components/sales/sales-list"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

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
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sales</h1>
        <Button asChild>
          <Link href="/sales/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Sale
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesList sales={sales} />
        </CardContent>
      </Card>
    </div>
  )
}
