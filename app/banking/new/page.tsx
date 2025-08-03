import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { createBankingEntry } from "@/app/banking/actions"

const BankingForm = dynamic(() => import("@/components/banking/banking-form"), {
  ssr: false,
  loading: () => <div>Chargement du formulaire...</div>,
})

export default function NewBankingEntryPage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Ajouter une nouvelle entrée bancaire</CardTitle>
          <CardDescription>Remplissez les détails de la nouvelle entrée bancaire.</CardDescription>
        </CardHeader>
        <CardContent>
          <BankingForm action={createBankingEntry} />
        </CardContent>
      </Card>
    </div>
  )
}
