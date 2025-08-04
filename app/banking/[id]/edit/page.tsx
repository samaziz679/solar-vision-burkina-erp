import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getBankingAccounts, getBankingTransactionById } from "@/lib/data/banking"
import { BankingForm } from "@/components/banking/banking-form"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function EditBankingTransactionPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const transaction = await getBankingTransactionById(params.id, user.id)
  const bankingAccounts = await getBankingAccounts(user.id)

  if (!transaction) {
    notFound()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Banking Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <BankingForm initialData={transaction} bankingAccounts={bankingAccounts} />
      </CardContent>
    </Card>
  )
}
