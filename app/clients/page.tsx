import { getClients } from "@/lib/data/clients"
import { ClientList } from "@/components/clients/client-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Clients</CardTitle>
          <Link href="/clients/new">
            <Button>Add New Client</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <ClientList clients={clients} />
        </CardContent>
      </Card>
    </div>
  )
}
