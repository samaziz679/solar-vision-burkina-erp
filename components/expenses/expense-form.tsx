"use client"

import { useFormState, useFormStatus, type FormAction } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import type { Expense } from "@/lib/supabase/types"
import { useState, useEffect } from "react"

interface ExpenseFormProps {
  action: FormAction
  initialData?: Expense
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Enregistrement..." : "Enregistrer la dépense"}
    </Button>
  )
}

export default function ExpenseForm({ action, initialData }: ExpenseFormProps) {
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
        <Label htmlFor="amount">Montant</Label>
        <Input id="amount" name="amount" type="number" step="0.01" defaultValue={initialData?.amount || ""} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Catégorie</Label>
        <Input id="category" name="category" type="text" defaultValue={initialData?.category || ""} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="payment_method">Méthode de paiement</Label>
        <Select name="payment_method" defaultValue={initialData?.payment_method || ""}>
          <SelectTrigger id="payment_method">
            <SelectValue placeholder="Sélectionner la méthode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Espèces">Espèces</SelectItem>
            <SelectItem value="Virement Bancaire">Virement Bancaire</SelectItem>
            <SelectItem value="Chèque">Chèque</SelectItem>
            <SelectItem value="Mobile Money">Mobile Money</SelectItem>
            <SelectItem value="Autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Description de la dépense"
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
