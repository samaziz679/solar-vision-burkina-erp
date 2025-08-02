import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ClientForm from "@/components/clients/client-form"
import { createClient } from "@/app/clients/actions"

export default function NewClientPage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Ajouter un nouveau client</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Nouveau Client</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm action={createClient} />
        </CardContent>
      </Card>
    </div>
  )
}
