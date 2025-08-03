import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { getSupplierById } from "@/lib/data/suppliers"
import { updateSupplier } from "@/app/suppliers/actions"

const SupplierForm = dynamic(() => import("@/components/suppliers/supplier-form"), {
  ssr: false,
  loading: () => <div>Chargement du formulaire...</div>,
})

export default async function EditSupplierPage({ params }: { params: { id: string } }) {
  const supplier = await getSupplierById(params.id)

  if (!supplier) {
    return (
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Fournisseur introuvable</CardTitle>
            <CardDescription>Le fournisseur avec l'ID spécifié n'existe pas.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Modifier le fournisseur</CardTitle>
          <CardDescription>Mettez à jour les détails du fournisseur.</CardDescription>
        </CardHeader>
        <CardContent>
          <SupplierForm action={updateSupplier} initialData={supplier} />
        </CardContent>
      </Card>
    </div>
  )
}
