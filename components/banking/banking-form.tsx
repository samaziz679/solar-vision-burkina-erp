"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createBankingTransaction, updateBankingTransaction } from "@/app/banking/actions"
import type { Tables } from "@/lib/supabase/types"

const formSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be positive"),
  type: z.enum(["income", "expense"], {
    required_error: "Transaction type is required",
  }),
  description: z.string().optional(),
})

type BankingFormValues = z.infer<typeof formSchema>

interface BankingFormProps {
  initialData?: Tables<"banking_transactions">
}

export function BankingForm({ initialData }: BankingFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(initialData ? updateBankingTransaction : createBankingTransaction, null)

  const form = useForm<BankingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      amount: 0,
      type: "income",
      description: "",
    },
  })

  async function onSubmit(values: BankingFormValues) {
    const formData = new FormData()
    formData.append("amount", values.amount.toString())
    formData.append("type", values.type)
    formData.append("description", values.description || "")
    if (initialData) {
      formData.append("id", initialData.id)
    }

    const result = await formAction(formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(initialData ? "Transaction updated successfully!" : "Transaction created successfully!")
      router.push("/banking")
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a transaction type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
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
          {initialData ? "Update Transaction" : "Create Transaction"}
        </Button>
      </form>
    </Form>
  )
}
