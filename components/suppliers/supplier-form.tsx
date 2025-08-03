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
import { Textarea } from "@/components/ui/textarea"
import { createSupplier, updateSupplier } from "@/app/suppliers/actions"
import type { Tables } from "@/lib/supabase/types"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address.").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
})

type SupplierFormValues = z.infer<typeof formSchema>

interface SupplierFormProps {
  initialData?: Tables<"suppliers">
}

export function SupplierForm({ initialData }: SupplierFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(initialData ? updateSupplier : createSupplier, null)

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  })

  async function onSubmit(values: SupplierFormValues) {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("email", values.email || "")
    formData.append("phone", values.phone || "")
    formData.append("address", values.address || "")
    if (initialData) {
      formData.append("id", initialData.id)
    }

    const result = await formAction(formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(initialData ? "Supplier updated successfully!" : "Supplier created successfully!")
      router.push("/suppliers")
      router.refresh()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {initialData ? "Update Supplier" : "Create Supplier"}
        </Button>
      </form>
    </Form>
  )
}
