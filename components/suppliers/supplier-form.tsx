"use client"

import { useFormState, useFormStatus, type FormAction } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Supplier } from "@/lib/supabase/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { useState, useEffect } from "react" // Import useState and useEffect

interface SupplierFormProps {
  action: FormAction
  initialData?: Supplier
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Enregistrement..." : "Enregistrer le fournisseur"}
    </Button>
  )
}

export default function SupplierForm({ action, initialData }: SupplierFormProps) {
  const [isClient, setIsClient] = useState(false) // State to track if component is mounted on client
  const [state, formAction] = useFormState(action, {})

  useEffect(() => {
    setIsClient(true) // Set to true once component mounts on client
  }, [])

  if (!isClient) {
    return <div>Chargement du formulaire...</div> // Render a loading state on the server
  }

  return (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <div className="grid gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" type="text" defaultValue={initialData?.name || ""} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contact_person">Personne Contact</Label>
        <Input id="contact_person" name="contact_person" type="text" defaultValue={initialData?.contact_person || ""} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={initialData?.email || ""} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={initialData?.phone || ""} />
      </div>
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="address">Adresse</Label>
        <Textarea
          id="address"
          name="address"
          placeholder="Adresse du fournisseur"
          defaultValue={initialData?.address || ""}
        />
      </div>
      {state?.error && (
        <Alert variant="destructive" className="md:col-span-2">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      <div className="md:col-span-2 flex justify-end">
        <SubmitButton />
      </div>
    </form>
  )
}
