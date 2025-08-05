import { notFound } from "next/navigation"
import { getBankingAccountById } from "@/lib/data/banking"
import { BankingForm } from "@/components/banking/banking-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function EditBankingAccountPage({ params }: { params: { id: string } }) {
  const id = params.id
  const account = await getBankingAccountById(id)

  if (!account) {
    notFound()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Banking Account</CardTitle>
        </CardHeader>
        <CardContent>
          <BankingForm initialData={account} />
        </CardContent>
      </Card>
    </div>
  )
}
