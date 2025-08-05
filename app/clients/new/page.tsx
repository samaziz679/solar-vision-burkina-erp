import { ClientForm } from "@/components/clients/client-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewClientPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Add New Client</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm />
        </CardContent>
      </Card>
    </div>
  )
}
