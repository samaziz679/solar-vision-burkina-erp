import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getClientById } from "@/lib/data/clients"
import { ClientForm } from "@/components/clients/client-form"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const client = await getClientById(params.id, user.id)

  if (!client) {
    notFound()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Client</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientForm initialData={client} />
      </CardContent>
    </Card>
  )
}
