import { notFound } from "next/navigation"
import { getClientById } from "@/lib/data/clients"
import { ClientForm } from "@/components/clients/client-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const id = params.id
  const client = await getClientById(id)

  if (!client) {
    notFound()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Client</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm initialData={client} />
        </CardContent>
      </Card>
    </div>
  )
}
