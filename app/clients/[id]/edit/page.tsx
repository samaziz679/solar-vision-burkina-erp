import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ClientForm } from "@/components/clients/client-form"
import { getClientById } from "@/lib/data/clients"

export default async function EditClientPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const client = await getClientById(params.id, user.id)

  if (!client) {
    redirect("/clients")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Edit Client</h2>
        <ClientForm initialData={client} />
      </div>
    </div>
  )
}
