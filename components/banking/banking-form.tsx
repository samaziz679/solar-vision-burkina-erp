"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addBankingTransaction, updateBankingTransaction } from "@/app/banking/actions"
import type { Tables } from "@/lib/supabase/types"
import { toast } from "sonner"

type BankingTransaction = Tables<"banking_transactions">

interface BankingFormProps {
  initialData?: BankingTransaction
}

export function BankingForm({ initialData }: BankingFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(
    initialData ? updateBankingTransaction : addBankingTransaction,
    {
      success: false,
      message: "",
      errors: undefined,
    },
  )

  const handleSubmit = async (formData: FormData) => {
    const result = await formAction(formData)
    if (result.success) {
      toast.success(result.message)
      router.push("/banking")
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Transaction" : "Add New Transaction"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="grid gap-4">
          {initialData && <input type="hidden" name="id" value={initialData.id} />}
          <div>
            <Label htmlFor="type">Type</Label>
            <Select name="type" defaultValue={initialData?.type || "income"}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            {state?.errors?.type && <p className="text-red-500 text-sm">{state.errors.type}</p>}
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
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={initialData?.description || ""} rows={3} />
            {state?.errors?.description && <p className="text-red-500 text-sm">{state.errors.description}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : initialData ? "Save Changes" : "Add Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
