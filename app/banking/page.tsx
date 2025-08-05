import { getBankingAccounts } from "@/lib/data/banking"
import { BankingList } from "@/components/banking/banking-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function BankingPage() {
  const accounts = await getBankingAccounts()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Banking Accounts</CardTitle>
          <Link href="/banking/new">
            <Button>Add New Account</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <BankingList accounts={accounts} />
        </CardContent>
      </Card>
    </div>
  )
}
