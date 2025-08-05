"use client"

import { useActionState, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Expense } from "@/lib/supabase/types"
import { createExpense, updateExpense } from "@/app/expenses/actions"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface ExpenseFormProps {
  initialData?: Expense
}

export function ExpenseForm({ initialData }: ExpenseFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [date, setDate] = useState<Date | undefined>(initialData ? new Date(initialData.date) : undefined)

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    if (!date) {
      return { success: false, error: "Date is required." }
    }
    formData.set("date", format(date, "yyyy-MM-dd"))

    if (isEditing && initialData) {
      const result = await updateExpense(initialData.id, formData)
      if (result.success) {
        toast.success("Expense updated successfully!")
        router.push("/expenses")
      } else {
        toast.error(result.error)
      }
      return result
    } else {
      const result = await createExpense(formData)
      if (result.success) {
        toast.success("Expense created successfully!")
        router.push("/expenses")
      } else {
        toast.error(result.error)
      }
      return result
    }
  }, null)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input id="amount" name="amount" type="number" step="0.01" defaultValue={initialData?.amount} required />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" defaultValue={initialData?.category} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={initialData?.description} required />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
        <Input type="hidden" name="date" value={date ? format(date, "yyyy-MM-dd") : ""} />
      </div>
      <Button type="submit" disabled={isPending}>
        {isEditing ? (isPending ? "Updating..." : "Update Expense") : isPending ? "Creating..." : "Create Expense"}
      </Button>
      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
    </form>
  )
}
