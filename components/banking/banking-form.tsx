"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createBankingTransaction, updateBankingTransaction } from "@/app/banking/actions"
import type { BankingAccount, BankingTransaction } from "@/lib/supabase/types"
import { useEffect } from "react"

const formSchema = z.object({
  type: z.enum(["income", "expense", "transfer"]),
  amount: z.coerce.number().min(0.01, "Amount must be positive"),
  description: z.string().min(1, "Description is required").max(255),
  date: z.string().min(1, "Date is required"),
  account_id: z.string().min(1, "Account is required"),
})

type BankingFormValues = z.infer<typeof formSchema>

interface BankingFormProps {
  initialData?: BankingTransaction | null
  bankingAccounts: BankingAccount[]
}

export function BankingForm({ initialData, bankingAccounts }: BankingFormProps) {
  const router = useRouter()
  const form = useForm<BankingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      type: "expense",
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
      account_id: bankingAccounts[0]?.id || "",
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

  async function onSubmit(values: BankingFormValues) {
    try {
      if (initialData) {
        await updateBankingTransaction(initialData.id, values)
        toast.success("Banking transaction updated successfully.")
      } else {
        await createBankingTransaction(values)
        toast.success("Banking transaction created successfully.")
      }
      router.push("/banking")
    } catch (error: any) {
      toast.error("Failed to save banking transaction.", {
        description: error.message || "An unexpected error occurred.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="account_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bankingAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        <Button type="submit">{initialData ? "Update Transaction" : "Create Transaction"}</Button>
      </form>
    </Form>
  )
}
