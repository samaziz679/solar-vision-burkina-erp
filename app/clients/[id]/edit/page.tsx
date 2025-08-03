import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import { getClientById } from "@/lib/data/clients"
import { updateClient } from "@/app/clients/actions"

const ClientForm = dynamic(() => import("@/components/clients/client-form"), {
  ssr: false,
  loading: () => <div>Chargement du formulaire...</div>,
})

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const id = params.id
  const { data: client, error } = await getClientById(id)

  if (error) {
    return <div className="text-red-500">Erreur: {error.message}</div>
  }

  if (!client) {
    return <div className="text-gray-500">Client non trouvé.</div>
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Modifier le client</CardTitle>
          <CardDescription>Mettez à jour les détails du client.</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientForm action={updateClient} initialData={client} />
        </CardContent>
      </Card>
    </div>
  )
}
