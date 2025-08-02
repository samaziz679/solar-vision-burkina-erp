"use client"

import { useState, useEffect } from "react"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import type { Expense } from "@/lib/supabase/types"
import { createExpense, updateExpense } from "@/app/expenses/actions"

interface ExpenseFormProps {
  expense?: Expense // Optional prop for editing existing expenses
}

const expenseCategories = [
  "salaire",
  "loyer",
  "emprunt",
  "electricite",
  "eau",
  "internet",
  "carburant",
  "maintenance",
  "autre",
] as const

export default function ExpenseForm({ expense }: ExpenseFormProps) {
  const router = useRouter()
  const isEditing = !!expense

  const action = isEditing ? updateExpense : createExpense
  const [state, formAction, isPending] = useFormState(action, { error: null, success: false })

  const [description, setDescription] = useState(expense?.description || "")
  const [category, setCategory] = useState<(typeof expenseCategories)[number]>(expense?.category || "autre")
  const [amount, setAmount] = useState<number>(expense?.amount || 0)
  const [expenseDate, setExpenseDate] = useState<string>(
    expense?.expense_date
      ? new Date(expense.expense_date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  )
  const [notes, setNotes] = useState(expense?.notes || "")

  useEffect(() => {
    if (state?.success) {
      router.push("/expenses") // Redirect to expenses list on success
    }
  }, [state, router])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Modifier la dépense" : "Enregistrer une nouvelle dépense"}</CardTitle>
        <CardDescription>
          {isEditing ? "Mettez à jour les détails de la dépense." : "Remplissez les détails de la dépense."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {isEditing && <input type="hidden" name="id" value={expense.id} />}

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select
                name="category"
                value={category}
                onValueChange={(value: (typeof expenseCategories)[number]) => setCategory(value)}
                disabled={isPending}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Montant (FCFA)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={0.01}
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="expense_date">Date de la dépense</Label>
            <Input
              id="expense_date"
              name="expense_date"
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              required
              disabled={isPending}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Input
              id="notes"
              name="notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isPending}
            />
          </div>

          {state?.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          {state?.success && (
            <Alert>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !description || !category || isNaN(amount) || amount <= 0 || !expenseDate}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Mise à jour..." : "Enregistrement..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Mettre à jour la dépense" : "Enregistrer la dépense"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
