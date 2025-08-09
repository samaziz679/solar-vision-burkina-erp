"use client"

import { useFormState } from "react-dom"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createExpense, updateExpense, type State } from "@/app/expenses/actions"
import type { Expense } from "@/lib/supabase/types"
import { toast } from "sonner"

interface ExpenseFormProps {
  expense?: Expense
}

export default function ExpenseForm({ expense }: ExpenseFormProps) {
  const initialState: State = { message: null, errors: {} }
  const updateExpenseWithId = updateExpense.bind(null, expense?.id || "")
  const [state, formAction] = useFormState(expense ? updateExpenseWithId : createExpense, initialState)

  if (state?.message) {
    if (state.message.includes("Failed")) {
      toast.error(state.message)
    } else {
      toast.success(state.message)
    }
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={expense?.id} />
      <div className="grid gap-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          defaultValue={expense?.amount || 0}
          required
          aria-describedby="amount-error"
        />
        {state?.errors?.amount && (
          <div id="amount-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.amount.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          type="text"
          defaultValue={expense?.category || ""}
          aria-describedby="category-error"
        />
        {state?.errors?.category && (
          <div id="category-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.category.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={expense?.description || ""}
          aria-describedby="description-error"
        />
        {state?.errors?.description && (
          <div id="description-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.description.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={expense?.date || new Date().toISOString().split("T")[0]}
          required
          aria-describedby="date-error"
        />
        {state?.errors?.date && (
          <div id="date-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.date.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <Button type="submit" className="w-full">
        {expense ? "Update Expense" : "Create Expense"}
      </Button>
    </form>
  )
}
