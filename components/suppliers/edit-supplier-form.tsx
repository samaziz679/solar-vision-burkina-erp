"use client"

import { useActionState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Supplier } from "@/lib/supabase/types"
import { updateSupplier } from "@/app/suppliers/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useEffect } from "react"

interface EditSupplierFormProps {
  supplier: Supplier
}

export default function EditSupplierForm({ supplier }: EditSupplierFormProps) {
  const [state, formAction] = useActionState(updateSupplier.bind(null, supplier.id), {
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
        <CardTitle>Modifier le fournisseur</CardTitle>
        <CardDescription>Mettez à jour les informations de ce fournisseur.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom du fournisseur</Label>
            <Input id="name" name="name" defaultValue={supplier.name} required />
            {state.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact_person">Personne de contact</Label>
            <Input id="contact_person" name="contact_person" defaultValue={supplier.contact_person} required />
            {state.errors?.contact_person && <p className="text-red-500 text-sm">{state.errors.contact_person}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={supplier.email || ""} />
            {state.errors?.email && <p className="text-red-500 text-sm">{state.errors.email}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" name="phone" defaultValue={supplier.phone} required />
            {state.errors?.phone && <p className="text-red-500 text-sm">{state.errors.phone}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" name="address" defaultValue={supplier.address || ""} />
            {state.errors?.address && <p className="text-red-500 text-sm">{state.errors.address}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Mise à jour..." : "Mettre à jour le fournisseur"}
          </Button>
          {state.message && !state.errors && <p className="text-green-500 text-sm mt-2">{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
