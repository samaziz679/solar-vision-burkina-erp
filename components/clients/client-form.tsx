"use client"

import { useFormState } from "react-dom"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createClientAction, updateClientAction, type State } from "@/app/clients/actions"
import type { Client } from "@/lib/supabase/types"
import { toast } from "sonner"

interface ClientFormProps {
  client?: Client
}

export default function ClientForm({ client }: ClientFormProps) {
  const initialState: State = { message: null, errors: {} }
  const updateClientWithId = updateClientAction.bind(null, client?.id || "")
  const [state, formAction] = useFormState(client ? updateClientWithId : createClientAction, initialState)

  if (state?.message) {
    if (state.message.includes("Failed")) {
      toast.error(state.message)
    } else {
      toast.success(state.message)
    }
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={client?.id} />
      <div className="grid gap-2">
        <Label htmlFor="name">Client Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          defaultValue={client?.name || ""}
          required
          aria-describedby="name-error"
        />
        {state?.errors?.name && (
          <div id="name-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.name.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contact_person">Contact Person</Label>
        <Input
          id="contact_person"
          name="contact_person"
          type="text"
          defaultValue={client?.contact_person || ""}
          aria-describedby="contact-person-error"
        />
        {state?.errors?.contact_person && (
          <div id="contact-person-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.contact_person.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={client?.email || ""} aria-describedby="email-error" />
        {state?.errors?.email && (
          <div id="email-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.email.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          name="phone_number"
          type="tel"
          defaultValue={client?.phone_number || ""}
          aria-describedby="phone-number-error"
        />
        {state?.errors?.phone_number && (
          <div id="phone-number-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.phone_number.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" name="address" defaultValue={client?.address || ""} aria-describedby="address-error" />
        {state?.errors?.address && (
          <div id="address-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.address.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <Button type="submit" className="w-full">
        {client ? "Update Client" : "Create Client"}
      </Button>
    </form>
  )
}
