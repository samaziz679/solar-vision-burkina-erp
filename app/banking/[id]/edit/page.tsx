import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BankingForm } from "@/components/banking/banking-form"
import { getBankingTransactionById } from "@/lib/data/banking"

export default async function EditBankingPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/login")
  }

  const transaction = await getBankingTransactionById(params.id, data.user.id)

  if (!transaction) {
    redirect("/banking")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center">Edit Banking Transaction</h1>
        <BankingForm initialData={transaction} />
      </div>
    </div>
  )
}
