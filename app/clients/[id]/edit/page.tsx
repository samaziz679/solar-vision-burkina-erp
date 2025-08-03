import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import EditClientForm from "@/components/clients/edit-client-form"
import { getClientById } from "@/lib/data/clients"
import { updateClient } from "@/app/clients/actions"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const client = await getClientById(params.id)

  if (!client) {
    notFound()
  }

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Modifier le client</CardTitle>
          <CardDescription>Mettez à jour les détails du client.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditClientForm initialData={client} action={updateClient} />
        </CardContent>
      </Card>
    </div>
  )
}
