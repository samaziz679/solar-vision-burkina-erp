"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addClient, updateClient } from "@/app/clients/actions"
import type { Tables } from "@/lib/supabase/types"
import { toast } from "sonner"

type Client = Tables<"clients">

interface ClientFormProps {
  initialData?: Client
}

export function ClientForm({ initialData }: ClientFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(initialData ? updateClient : addClient, {
    success: false,
    message: "",
    errors: undefined,
  })

  const handleSubmit = async (formData: FormData) => {
    const result = await formAction(formData)
    if (result.success) {
      toast.success(result.message)
      router.push("/clients")
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Client" : "Add New Client"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="grid gap-4">
          {initialData && <input type="hidden" name="id" value={initialData.id} />}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={initialData?.name || ""} required />
            {state?.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={initialData?.email || ""} />
            {state?.errors?.email && <p className="text-red-500 text-sm">{state.errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" defaultValue={initialData?.phone || ""} />
            {state?.errors?.phone && <p className="text-red-500 text-sm">{state.errors.phone}</p>}
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" name="address" defaultValue={initialData?.address || ""} rows={3} />
            {state?.errors?.address && <p className="text-red-500 text-sm">{state.errors.address}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : initialData ? "Save Changes" : "Add Client"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
