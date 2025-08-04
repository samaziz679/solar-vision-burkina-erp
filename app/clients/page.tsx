import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ClientList } from "@/components/clients/client-list"
import { getClients } from "@/lib/data/clients"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ClientsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const clients = await getClients(user.id)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Clients</CardTitle>
        <Button asChild>
          <Link href="/clients/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Client
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ClientList clients={clients} />
      </CardContent>
    </Card>
  )
}
