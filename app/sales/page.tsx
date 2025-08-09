import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getSales } from "@/lib/data/sales"
import { SalesList } from "@/components/sales/sales-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default async function SalesPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  const sales = await getSales(user.id)

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Sales</h1>
      <SalesList sales={sales} />
      <Button asChild>
        <Link href="/sales/new">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Sale
        </Link>
      </Button>
    </div>
  )
}
