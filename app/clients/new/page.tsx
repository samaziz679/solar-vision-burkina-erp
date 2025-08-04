import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientForm } from "@/components/clients/client-form"

export default function NewClientPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Client</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientForm />
      </CardContent>
    </Card>
  )
}
