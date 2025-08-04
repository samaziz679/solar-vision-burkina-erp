import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BankingList } from "@/components/banking/banking-list"
import { getBankingTransactions } from "@/lib/data/banking"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function BankingPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const transactions = await getBankingTransactions(user.id)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Banking Transactions</CardTitle>
        <Button asChild>
          <Link href="/banking/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Transaction
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <BankingList transactions={transactions} />
      </CardContent>
    </Card>
  )
}
