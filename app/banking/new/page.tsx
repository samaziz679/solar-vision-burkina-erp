import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BankingForm } from "@/components/banking/banking-form"
import { getBankingAccounts } from "@/lib/data/banking"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function NewBankingTransactionPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const bankingAccounts = await getBankingAccounts(user.id)

  if (bankingAccounts.length === 0) {
    // Redirect to a page where they can create an account first
    redirect("/setup-required?message=Please create at least one banking account before adding transactions.")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Banking Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <BankingForm bankingAccounts={bankingAccounts} />
      </CardContent>
    </Card>
  )
}
