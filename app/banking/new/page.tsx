import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BankingForm from "@/components/banking/banking-form"
import { addBankEntry } from "@/app/banking/actions"

export default function NewBankingPage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ajouter une nouvelle opération bancaire</CardTitle>
          <CardDescription>Remplissez les détails de la nouvelle opération bancaire.</CardDescription>
        </CardHeader>
        <CardContent>
          <BankingForm action={addBankEntry} />
        </CardContent>
      </Card>
    </div>
  )
}
