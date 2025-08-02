import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { getClients } from "@/lib/data/clients" // Import the new data function
import ClientList from "@/components/clients/client-list" // Will be created next

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <Button asChild>
          <Link href="/clients/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un client
          </Link>
        </Button>
      </div>
      <ClientList clients={clients} />
    </div>
  )
}
