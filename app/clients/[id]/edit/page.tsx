import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ClientForm from "@/components/clients/client-form"
import { getClientById } from "@/lib/data/clients"
import { updateClient } from "@/app/clients/actions"

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const client = await getClientById(params.id)

  if (!client) {
    notFound()
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
