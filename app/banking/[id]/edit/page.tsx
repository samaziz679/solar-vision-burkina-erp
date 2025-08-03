import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { getBankingById } from "@/lib/data/banking"

const BankingForm = dynamic(() => import("@/components/banking/banking-form"), {
  ssr: false,
  loading: () => <div>Chargement du formulaire...</div>,
})

import { updateBanking } from "@/app/banking/actions"

export default async function EditBankingPage({ params }: { params: { id: string } }) {
  const banking = await getBankingById(params.id)

  if (!banking) {
    return <div className="text-center py-8">Transaction bancaire non trouvée.</div>
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Modifier la transaction bancaire</CardTitle>
          <CardDescription>Mettez à jour les détails de la transaction bancaire.</CardDescription>
        </CardHeader>
        <CardContent>
          <BankingForm action={updateBanking} initialData={banking} />
        </CardContent>
      </Card>
    </div>
  )
}
