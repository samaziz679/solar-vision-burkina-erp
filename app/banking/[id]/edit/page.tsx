import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BankingForm } from "@/components/banking/banking-form"
import { getBankingTransactionById, getBankingAccounts } from "@/lib/data/banking"

export default async function EditBankingPage({
  params,
}: {
  params: { id: string }
}) {
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
    redirect("/banking")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Edit Transaction</h2>
        <BankingForm initialData={transaction} bankingAccounts={bankingAccounts} />
      </div>
    </div>
  )
}
