"use client"

import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Purchase, Supplier } from "@/lib/supabase/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { useState, useEffect } from "react"

interface PurchaseFormProps {
  action: (prevState: any, formData: FormData) => Promise<{ error?: string }>
  initialData?: Purchase
  suppliers: Supplier[]
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Enregistrement..." : "Enregistrer l'achat"}
    </Button>
  )
}

export default function PurchaseForm({ action, initialData, suppliers }: PurchaseFormProps) {
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
        <Label htmlFor="purchase_date">Date d'achat</Label>
        <Input
          id="purchase_date"
          name="purchase_date"
          type="date"
          defaultValue={initialData?.purchase_date || new Date().toISOString().split("T")[0]}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="supplier_id">Fournisseur</Label>
        <Select name="supplier_id" defaultValue={initialData?.supplier_id || ""}>
          <SelectTrigger id="supplier_id">
            <SelectValue placeholder="Sélectionner un fournisseur" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((supplier) => (
              <SelectItem key={supplier.id} value={supplier.id}>
                {supplier.name}
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
