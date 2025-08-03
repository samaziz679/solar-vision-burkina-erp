import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ClientForm from "@/components/clients/client-form"
import { addClient } from "@/app/clients/actions"

export default function NewClientPage() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ajouter un nouveau client</CardTitle>
          <CardDescription>Remplissez les détails du nouveau client.</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientForm action={addClient} />
        </CardContent>
      </Card>
    </div>
  )
}
