import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { getBankEntryById } from "@/lib/data/banking"
import { updateBankEntry } from "@/app/banking/actions"

const BankingForm = dynamic(() => import("@/components/banking/banking-form"), {
  ssr: false,
  loading: () => <div>Chargement du formulaire...</div>,
})

export default async function EditBankingPage({ params }: { params: { id: string } }) {
  const bankEntry = await getBankEntryById(params.id)

  if (!bankEntry) {
    return (
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Opération Bancaire Introuvable</CardTitle>
            <CardDescription>L'opération que vous essayez de modifier n'existe pas.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Modifier l'opération bancaire</CardTitle>
          <CardDescription>Mettez à jour les détails de l'opération bancaire.</CardDescription>
        </CardHeader>
        <CardContent>
          <BankingForm action={updateBankEntry} initialData={bankEntry} />
        </CardContent>
      </Card>
    </div>
  )
}
