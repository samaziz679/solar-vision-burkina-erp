"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createBankingEntry, updateBankingEntry } from "@/app/banking/actions"
import { useRouter } from "next/navigation"
import type { Banking } from "@/lib/supabase/types"

const formSchema = z.object({
  account_name: z.string().min(2, {
    message: "Account name must be at least 2 characters.",
  }),
  account_number: z.string().min(5, {
    message: "Account number must be at least 5 characters.",
  }),
  bank_name: z.string().min(2, {
    message: "Bank name must be at least 2 characters.",
  }),
  balance: z.coerce.number().min(0, {
    message: "Balance must be a positive number.",
  }),
  notes: z.string().optional(),
})

type BankingFormProps = {
  initialData?: Banking | null
}

export function BankingForm({ initialData }: BankingFormProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      account_name: "",
      account_number: "",
      bank_name: "",
      balance: 0,
      notes: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let error: string | null = null
    if (initialData) {
      // Update existing entry
      const result = await updateBankingEntry(initialData.id, values)
      error = result?.error
    } else {
      // Create new entry
      const result = await createBankingEntry(values)
      error = result?.error
    }

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: `Banking entry ${initialData ? "updated" : "created"} successfully.`,
      })
      router.push("/banking")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="account_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input placeholder="Savings Account" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="account_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bank_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Name</FormLabel>
              <FormControl>
                <Input placeholder="Bank of America" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Balance</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any additional notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{initialData ? "Update" : "Create"} Banking Entry</Button>
      </form>
    </Form>
  )
}
