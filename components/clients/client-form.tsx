"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Client } from "@/lib/supabase/types"
import { createClient, updateClient } from "@/app/clients/actions"
import { toast } from "sonner"

interface ClientFormProps {
  initialData?: Client
}

export function ClientForm({ initialData }: ClientFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    if (isEditing && initialData) {
      const result = await updateClient(initialData.id, formData)
      if (result.success) {
        toast.success("Client updated successfully!")
        router.push("/clients")
      } else {
        toast.error(result.error)
      }
      return result
    } else {
      const result = await createClient(formData)
      if (result.success) {
        toast.success("Client created successfully!")
        router.push("/clients")
      } else {
        toast.error(result.error)
      }
      return result
    }
  }, null)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={initialData?.name} required />
      </div>
      <div>
        <Label htmlFor="contact_person">Contact Person</Label>
        <Input id="contact_person" name="contact_person" defaultValue={initialData?.contact_person} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={initialData?.email} required />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={initialData?.phone} required />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" name="address" defaultValue={initialData?.address} required />
      </div>
      <Button type="submit" disabled={isPending}>
        {isEditing ? (isPending ? "Updating..." : "Update Client") : isPending ? "Creating..." : "Create Client"}
      </Button>
      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
    </form>
  )
}
