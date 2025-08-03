"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addExpense, updateExpense } from "@/app/expenses/actions"
import type { Tables } from "@/lib/supabase/types"
import { toast } from "sonner"

type Expense = Tables<"expenses">

interface ExpenseFormProps {
  initialData?: Expense
}

export function ExpenseForm({ initialData }: ExpenseFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(initialData ? updateExpense : addExpense, {
    success: false,
    message: "",
    errors: undefined,
  })

  const handleSubmit = async (formData: FormData) => {
    const result = await formAction(formData)
    if (result.success) {
      toast.success(result.message)
      router.push("/expenses")
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Expense" : "Add New Expense"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="grid gap-4">
          {initialData && <input type="hidden" name="id" value={initialData.id} />}
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={initialData?.date || new Date().toISOString().split("T")[0]}
              required
            />
            {state?.errors?.date && <p className="text-red-500 text-sm">{state.errors.date}</p>}
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              defaultValue={initialData?.amount || ""}
              required
            />
            {state?.errors?.amount && <p className="text-red-500 text-sm">{state.errors.amount}</p>}
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" defaultValue={initialData?.category || ""} />
            {state?.errors?.category && <p className="text-red-500 text-sm">{state.errors.category}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={initialData?.description || ""} rows={3} />
            {state?.errors?.description && <p className="text-red-500 text-sm">{state.errors.description}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : initialData ? "Save Changes" : "Add Expense"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
