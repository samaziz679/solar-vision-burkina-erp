import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BankingForm from "@/components/banking/banking-form"
import { createBankEntry } from "@/app/banking/actions"

export default function NewBankingPage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Ajouter une nouvelle entrée bancaire</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle Entrée Bancaire</CardTitle>
        </CardHeader>
        <CardContent>
          <BankingForm action={createBankEntry} />
        </CardContent>
      </Card>
    </div>
  )
}
