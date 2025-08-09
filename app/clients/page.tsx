import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { ClientList } from "@/components/clients/client-list"
import { getClients } from "@/lib/data/clients"
import { requireAuth } from "@/lib/auth"

export default async function ClientsPage() {
  await requireAuth()
  const clients = await getClients()

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Clients</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/clients/new">
              <PlusCircle className="h-3.5 w-3.5 mr-2" />
              Add New Client
            </Link>
          </Button>
        </div>
      </div>
      <ClientList clients={clients} />
    </div>
  )
}
