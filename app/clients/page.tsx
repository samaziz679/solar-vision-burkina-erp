import { Suspense } from "react"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ClientList, { ClientListSkeleton } from "@/components/clients/client-list"
import { getClients } from "@/lib/data/clients"

export const dynamic = "force-dynamic"

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Clients</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/clients/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un client
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Clients</CardTitle>
          <CardDescription>Gérez vos informations clients.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ClientListSkeleton />}>
            <ClientList clients={clients} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
