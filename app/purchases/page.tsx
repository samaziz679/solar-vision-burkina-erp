import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PurchaseList } from "@/components/purchases/purchase-list"
import { getPurchases } from "@/lib/data/purchases"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function PurchasesPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const purchases = await getPurchases(user.id)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Purchases</CardTitle>
        <Button asChild>
          <Link href="/purchases/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Purchase
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <PurchaseList purchases={purchases} />
      </CardContent>
    </Card>
  )
}
