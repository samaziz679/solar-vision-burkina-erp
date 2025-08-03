import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ClientForm } from "@/components/clients/client-form"
import { getClientById } from "@/lib/data/clients"

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/login")
  }

  const client = await getClientById(params.id, data.user.id)

  if (!client) {
    redirect("/clients")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold text-center">Edit Client</h1>
        <ClientForm initialData={client} />
      </div>
    </div>
  )
}
