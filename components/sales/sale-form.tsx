"use client"

import { useFormState, useFormStatus, type FormAction } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Sale, Client } from "@/lib/supabase/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { useState, useEffect } from "react"

interface SaleFormProps {
  action: FormAction
  initialData?: Sale
  clients: Client[]
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Enregistrement..." : "Enregistrer la vente"}
    </Button>
  )
}

export default function SaleForm({ action, initialData, clients }: SaleFormProps) {
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
        <Label htmlFor="sale_date">Date de vente</Label>
        <Input
          id="sale_date"
          name="sale_date"
          type="date"
          defaultValue={initialData?.sale_date || new Date().toISOString().split("T")[0]}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="client_id">Client</Label>
        <Select name="client_id" defaultValue={initialData?.client_id || ""}>
          <SelectTrigger id="client_id">
            <SelectValue placeholder="Sélectionner un client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="total_amount">Montant Total</Label>
        <Input
          id="total_amount"
          name="total_amount"
          type="number"
          step="0.01"
          defaultValue={initialData?.total_amount || ""}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="payment_status">Statut de Paiement</Label>
        <Select name="payment_status" defaultValue={initialData?.payment_status || ""}>
          <SelectTrigger id="payment_status">
            <SelectValue placeholder="Sélectionner le statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">En attente</SelectItem>
            <SelectItem value="Paid">Payé</SelectItem>
            <SelectItem value="Partially Paid">Partiellement payé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" placeholder="Notes supplémentaires" defaultValue={initialData?.notes || ""} />
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
