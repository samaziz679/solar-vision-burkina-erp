import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import EditBankingForm from "@/components/banking/edit-banking-form"
import { getBankEntryById } from "@/lib/data/banking"
import { updateBankEntry } from "@/app/banking/actions"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EditBankingPage({ params }: { params: { id: string } }) {
  const bankEntry = await getBankEntryById(params.id)

  if (!bankEntry) {
    notFound()
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Modifier l'opération bancaire</CardTitle>
          <CardDescription>Mettez à jour les détails de l'opération bancaire.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditBankingForm initialData={bankEntry} action={updateBankEntry} />
        </CardContent>
      </Card>
    </div>
  )
}
