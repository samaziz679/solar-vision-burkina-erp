import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientForm } from "@/components/clients/client-form"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function NewClientPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Client</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientForm />
      </CardContent>
    </Card>
  )
}
