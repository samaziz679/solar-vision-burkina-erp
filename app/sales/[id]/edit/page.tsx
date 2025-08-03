import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { getSaleById } from "@/lib/data/sales"
import { updateSale } from "@/app/sales/actions"
import { getClients } from "@/lib/data/clients"

const SaleForm = dynamic(() => import("@/components/sales/sale-form"), {
  ssr: false,
  loading: () => <div>Chargement du formulaire...</div>,
})

export default async function EditSalePage({ params }: { params: { id: string } }) {
  const sale = await getSaleById(params.id)
  const clients = await getClients()

  if (!sale) {
    return (
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Vente Introuvable</CardTitle>
            <CardDescription>La vente que vous essayez de modifier n'existe pas.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Modifier la vente</CardTitle>
          <CardDescription>Mettez à jour les détails de la vente.</CardDescription>
        </CardHeader>
        <CardContent>
          <SaleForm action={updateSale} initialData={sale} clients={clients} />
        </CardContent>
      </Card>
    </div>
  )
}
