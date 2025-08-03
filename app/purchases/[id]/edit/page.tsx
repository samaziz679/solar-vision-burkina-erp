import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { getPurchaseById } from "@/lib/data/purchases"
import { updatePurchase } from "@/app/purchases/actions"

const PurchaseForm = dynamic(() => import("@/components/purchases/purchase-form"), {
  ssr: false,
  loading: () => <div>Chargement du formulaire...</div>,
})

export default async function EditPurchasePage({ params }: { params: { id: string } }) {
  const id = params.id
  const { data: purchase, error } = await getPurchaseById(id)

  if (error) {
    return <div className="text-red-500">Erreur: {error.message}</div>
  }

  if (!purchase) {
    return <div className="text-gray-500">Achat non trouvé.</div>
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
