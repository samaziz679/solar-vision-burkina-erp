"use client"

import { useActionState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useEffect } from "react"
import { createClient, updateClient } from "@/app/clients/actions"
import type { Client } from "@/lib/supabase/types"

interface ClientFormProps {
  initialData?: Client | null
}

export default function ClientForm({ initialData }: ClientFormProps) {
  const isEditing = !!initialData?.id
  const [state, formAction] = useActionState(isEditing ? updateClient.bind(null, initialData.id!) : createClient, {
    message: "",
    errors: undefined,
  })
  const { pending } = useFormStatus()

  useEffect(() => {
    if (state.message && !state.errors) {
      toast.success(state.message)
    } else if (state.message && state.errors) {
      toast.error("Erreur de validation", {
        description: state.message,
      })
    }
  }, [state])

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{isEditing ? "Modifier le client" : "Ajouter un nouveau client"}</CardTitle>
        <CardDescription>
          {isEditing ? "Mettez à jour les informations de ce client." : "Remplissez les détails du nouveau client."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom du client</Label>
            <Input id="name" name="name" defaultValue={initialData?.name || ""} required />
            {state.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact_person">Personne de contact</Label>
            <Input id="contact_person" name="contact_person" defaultValue={initialData?.contact_person || ""} />
            {state.errors?.contact_person && <p className="text-red-500 text-sm">{state.errors.contact_person}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={initialData?.email || ""} />
            {state.errors?.email && <p className="text-red-500 text-sm">{state.errors.email}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" name="phone" type="tel" defaultValue={initialData?.phone || ""} />
            {state.errors?.phone && <p className="text-red-500 text-sm">{state.errors.phone}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Adresse</Label>
            <Textarea id="address" name="address" defaultValue={initialData?.address || ""} />
            {state.errors?.address && <p className="text-red-500 text-sm">{state.errors.address}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending
              ? isEditing
                ? "Mise à jour..."
                : "Création..."
              : isEditing
                ? "Mettre à jour le client"
                : "Créer le client"}
          </Button>
          {state.message && !state.errors && <p className="text-green-500 text-sm mt-2">{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
