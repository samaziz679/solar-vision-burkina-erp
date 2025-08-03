"use client"

import { useFormState, useFormStatus, type FormAction } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Purchase } from "@/lib/supabase/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { useState, useEffect } from "react"

interface PurchaseFormProps {
  action: FormAction
  initialData?: Purchase
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Enregistrement..." : "Enregistrer l'achat"}
    </Button>
  )
}

export default function PurchaseForm({ action, initialData }: PurchaseFormProps) {
  const [state, formAction] = useFormState(action, {})
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div>Chargement du formulaire...</div>
  }

  return (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <div className="grid gap-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" name="date" type="date" defaultValue={initialData?.date || ""} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="supplier_id">Fournisseur</Label>
        <Input id="supplier_id" name="supplier_id" type="text" defaultValue={initialData?.supplier_id || ""} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="product_id">Produit</Label>
        <Input id="product_id" name="product_id" type="text" defaultValue={initialData?.product_id || ""} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="quantity">Quantité</Label>
        <Input id="quantity" name="quantity" type="number" defaultValue={initialData?.quantity || ""} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="unit_price">Prix unitaire</Label>
        <Input
          id="unit_price"
          name="unit_price"
          type="number"
          step="0.01"
          defaultValue={initialData?.unit_price || ""}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="total_price">Prix total</Label>
        <Input
          id="total_price"
          name="total_price"
          type="number"
          step="0.01"
          defaultValue={initialData?.total_price || ""}
          required
        />
      </div>
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Description de l'achat"
          defaultValue={initialData?.description || ""}
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
