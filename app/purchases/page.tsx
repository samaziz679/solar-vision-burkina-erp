import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPurchases } from "@/lib/data/purchases"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { PurchaseList } from "@/components/purchases/purchase-list"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

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
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Purchases</h1>
        <Button asChild>
          <Link href="/purchases/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Purchase
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <PurchaseList purchases={purchases} />
        </CardContent>
      </Card>
    </div>
  )
}
