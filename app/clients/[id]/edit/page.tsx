import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ClientForm from "@/components/clients/client-form"
import { getClientById } from "@/lib/data/clients"
import { updateClient } from "@/app/clients/actions"

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const id = params.id
  const client = await getClientById(id)

  if (!client) {
    notFound()
  }

  const updateActionWithId = updateClient.bind(null, id)

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Modifier le client</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Modifier le client</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm action={updateActionWithId} initialData={client} />
        </CardContent>
      </Card>
    </div>
  )
}
