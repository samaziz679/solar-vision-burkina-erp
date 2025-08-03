import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { getPurchaseById } from "@/lib/data/purchases"

const PurchaseForm = dynamic(() => import("@/components/purchases/purchase-form"), {
  ssr: false,
  loading: () => <div>Chargement du formulaire...</div>,
})

import { updatePurchase } from "@/app/purchases/actions"

export default async function EditPurchasePage({ params }: { params: { id: string } }) {
  const purchase = await getPurchaseById(params.id)

  if (!purchase) {
    return <div className="text-center py-8">Achat non trouvé.</div>
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Modifier l'achat</CardTitle>
          <CardDescription>Mettez à jour les détails de l'achat.</CardDescription>
        </CardHeader>
        <CardContent>
          <PurchaseForm action={updatePurchase} initialData={purchase} />
        </CardContent>
      </Card>
    </div>
  )
}
