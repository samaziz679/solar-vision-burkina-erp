import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BankingForm } from "@/components/banking/banking-form"
import { getBankingEntryById } from "@/lib/data/banking"
import { notFound } from "next/navigation"
import { requireAuth } from "@/lib/auth"

type EditBankingPageProps = {
  params: { id: string }
}

export default async function EditBankingPage({ params }: EditBankingPageProps) {
  await requireAuth()
  const bankingEntry = await getBankingEntryById(params.id)

  if (!bankingEntry) {
    notFound()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Banking Entry</CardTitle>
        <CardDescription>Update the details for this banking entry.</CardDescription>
      </CardHeader>
      <CardContent>
        <BankingForm initialData={bankingEntry} />
      </CardContent>
    </Card>
  )
}
