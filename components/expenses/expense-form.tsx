"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { createExpense, updateExpense } from "@/app/expenses/actions"
import type { Tables } from "@/lib/supabase/types"

const formSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be positive"),
  date: z.date({
    required_error: "A date is required.",
  }),
  category: z.string().optional(),
  description: z.string().optional(),
})

type ExpenseFormValues = z.infer<typeof formSchema>

interface ExpenseFormProps {
  initialData?: Tables<"expenses">
}

export function ExpenseForm({ initialData }: ExpenseFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(initialData ? updateExpense : createExpense, null)

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          date: new Date(initialData.date),
        }
      : {
          amount: 0,
          date: new Date(),
          category: "",
          description: "",
        },
  })

  async function onSubmit(values: ExpenseFormValues) {
    const formData = new FormData()
    formData.append("amount", values.amount.toString())
    formData.append("date", format(values.date, "yyyy-MM-dd"))
    formData.append("category", values.category || "")
    formData.append("description", values.description || "")
    if (initialData) {
      formData.append("id", initialData.id)
    }

    const result = await formAction(formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(initialData ? "Expense updated successfully!" : "Expense created successfully!")
      router.push("/expenses")
      router.refresh()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {initialData ? "Update Expense" : "Create Expense"}
        </Button>
      </form>
    </Form>
  )
}
