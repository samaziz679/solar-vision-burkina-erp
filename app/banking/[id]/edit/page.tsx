import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BankingForm from "@/components/banking/banking-form"
import { getBankEntryById } from "@/lib/data/banking"
import { updateBankEntry } from "@/app/banking/actions"

export default async function EditBankingPage({ params }: { params: { id: string } }) {
  const bankEntry = await getBankEntryById(params.id)

  if (!bankEntry) {
    notFound()
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Modifier l'entrée bancaire</CardTitle>
          <CardDescription>Mettez à jour les détails de l'entrée bancaire.</CardDescription>
        </CardHeader>
        <CardContent>
          <BankingForm action={updateBankEntry} initialData={bankEntry} />
        </CardContent>
      </Card>
    </div>
  )
}
