"use client"

import { useActionState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useEffect } from "react"
import { createExpense, updateExpense } from "@/app/expenses/actions"
import type { Expense } from "@/lib/supabase/types"

interface ExpenseFormProps {
  initialData?: Expense | null
}

export default function ExpenseForm({ initialData }: ExpenseFormProps) {
  const isEditing = !!initialData?.id
  const [state, formAction] = useActionState(isEditing ? updateExpense.bind(null, initialData.id!) : createExpense, {
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
        <CardTitle>{isEditing ? "Modifier la dépense" : "Ajouter une nouvelle dépense"}</CardTitle>
        <CardDescription>
          {isEditing ? "Mettez à jour les détails de cette dépense." : "Remplissez les détails de la nouvelle dépense."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={initialData?.description || ""} required />
            {state.errors?.description && <p className="text-red-500 text-sm">{state.errors.description}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Montant</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              defaultValue={initialData?.amount || 0}
              required
            />
            {state.errors?.amount && <p className="text-red-500 text-sm">{state.errors.amount}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Catégorie</Label>
            <Input id="category" name="category" defaultValue={initialData?.category || ""} />
            {state.errors?.category && <p className="text-red-500 text-sm">{state.errors.category}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expense_date">Date de dépense</Label>
            <Input
              id="expense_date"
              name="expense_date"
              type="date"
              defaultValue={initialData?.expense_date || ""}
              required
            />
            {state.errors?.expense_date && <p className="text-red-500 text-sm">{state.errors.expense_date}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending
              ? isEditing
                ? "Mise à jour..."
                : "Création..."
              : isEditing
                ? "Mettre à jour la dépense"
                : "Créer la dépense"}
          </Button>
          {state.message && !state.errors && <p className="text-green-500 text-sm mt-2">{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
