import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientForm } from "@/components/clients/client-form"
import { getClientById } from "@/lib/data/clients"
import { notFound } from "next/navigation"
import { requireAuth } from "@/lib/auth"

type EditClientPageProps = {
  params: { id: string }
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  await requireAuth()
  const client = await getClientById(params.id)

  if (!client) {
    notFound()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Client</CardTitle>
        <CardDescription>Update the details for this client.</CardDescription>
      </CardHeader>
      <CardContent>
        <ClientForm initialData={client} />
      </CardContent>
    </Card>
  )
}
