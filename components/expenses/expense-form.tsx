"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createExpense, updateExpense } from "@/app/expenses/actions"
import type { Expense } from "@/lib/supabase/types"
import { useEffect } from "react"

const formSchema = z.object({
  description: z.string().min(1, "Description is required").max(255),
  amount: z.coerce.number().min(0.01, "Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  category: z.string().min(1, "Category is required").max(100),
})

type ExpenseFormValues = z.infer<typeof formSchema>

interface ExpenseFormProps {
  initialData?: Expense | null
}

export function ExpenseForm({ initialData }: ExpenseFormProps) {
  const router = useRouter()
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      description: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      category: "",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        date: initialData.date.split("T")[0], // Format date for input type="date"
      })
    }
  }, [initialData, form])

  async function onSubmit(values: ExpenseFormValues) {
    try {
      if (initialData) {
        await updateExpense(initialData.id, values)
        toast.success("Expense updated successfully.")
      } else {
        await createExpense(values)
        toast.success("Expense created successfully.")
      }
      router.push("/expenses")
    } catch (error: any) {
      toast.error("Failed to save expense.", {
        description: error.message || "An unexpected error occurred.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
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
        <Button type="submit">{initialData ? "Update Expense" : "Create Expense"}</Button>
      </form>
    </Form>
  )
}
