import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getBankingTransactions } from "@/lib/data/banking"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { BankingList } from "@/components/banking/banking-list"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

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
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Banking Transactions</h1>
        <Button asChild>
          <Link href="/banking/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <BankingList transactions={transactions} />
        </CardContent>
      </Card>
    </div>
  )
}
