"use client"

import { useFormState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Expense } from "@/lib/supabase/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { updateExpense } from "@/app/expenses/actions"

interface EditExpenseFormProps {
  initialData: Expense
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Mise à jour..." : "Mettre à jour la dépense"}
    </Button>
  )
}

export default function EditExpenseForm({ initialData }: EditExpenseFormProps) {
  const [state, formAction] = useFormState(updateExpense, {})

  return (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="id" value={initialData.id} />
      <div className="grid gap-2">
        <Label htmlFor="expense_date">Date de la dépense</Label>
        <Input id="expense_date" name="expense_date" type="date" defaultValue={initialData.expense_date} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="amount">Montant</Label>
        <Input id="amount" name="amount" type="number" step="0.01" defaultValue={initialData.amount} required />
      </div>
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Description de la dépense"
          defaultValue={initialData.description}
          required
        />
      </div>
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select name="category" defaultValue={initialData.category || ""}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Salaires">Salaires</SelectItem>
            <SelectItem value="Loyer">Loyer</SelectItem>
            <SelectItem value="Services Publics">Services Publics</SelectItem>
            <SelectItem value="Transport">Transport</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" placeholder="Notes supplémentaires" defaultValue={initialData.notes || ""} />
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
