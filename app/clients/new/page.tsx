import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientForm } from "@/components/clients/client-form"
import { requireAuth } from "@/lib/auth"

export default async function NewClientPage() {
  await requireAuth()

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Client</CardTitle>
        <CardDescription>Fill in the details for the new client.</CardDescription>
      </CardHeader>
      <CardContent>
        <ClientForm />
      </CardContent>
    </Card>
  )
}
