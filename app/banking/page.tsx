import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BankingList } from "@/components/banking/banking-list"
import { getBankingTransactions, getBankingAccounts } from "@/lib/data/banking"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default async function BankingPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const transactions = await getBankingTransactions(user.id)
  const accounts = await getBankingAccounts(user.id)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Banking Transactions</h2>
          <Button asChild>
            <Link href="/banking/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add New Transaction
            </Link>
          </Button>
        </div>
        <BankingList transactions={transactions} bankingAccounts={accounts} />
      </div>
    </div>
  )
}
