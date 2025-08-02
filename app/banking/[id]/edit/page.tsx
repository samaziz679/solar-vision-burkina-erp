import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BankingForm from "@/components/banking/banking-form"
import { fetchBankEntryById } from "@/lib/data/banking"
import { updateBankEntry } from "@/app/banking/actions"

export default async function EditBankingPage({ params }: { params: { id: string } }) {
  const id = params.id
  const bankEntry = await fetchBankEntryById(id)

  if (!bankEntry) {
    notFound()
  }

  const updateActionWithId = updateBankEntry.bind(null, id)

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Modifier l'entrée bancaire</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Modifier l'entrée</CardTitle>
        </CardHeader>
        <CardContent>
          <BankingForm action={updateActionWithId} initialData={bankEntry} />
        </CardContent>
      </Card>
    </div>
  )
}
