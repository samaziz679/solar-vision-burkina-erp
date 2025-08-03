import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { getSaleById } from "@/lib/data/sales"
import { updateSale } from "@/app/sales/actions"

const SaleForm = dynamic(() => import("@/components/sales/sale-form"), {
  ssr: false,
  loading: () => <div>Chargement du formulaire...</div>,
})

export default async function EditSalePage({ params }: { params: { id: string } }) {
  const id = params.id
  const { data: sale, error } = await getSaleById(id)

  if (error) {
    return <div className="text-red-500">Erreur: {error.message}</div>
  }

  if (!sale) {
    return <div className="text-gray-500">Vente non trouvée.</div>
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Modifier la vente</CardTitle>
          <CardDescription>Mettez à jour les détails de la vente.</CardDescription>
        </CardHeader>
        <CardContent>
          <SaleForm action={updateSale} initialData={sale} />
        </CardContent>
      </Card>
    </div>
  )
}
