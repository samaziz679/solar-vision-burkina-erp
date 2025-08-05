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
import { createSale, updateSale } from "@/app/sales/actions" // Added updateSale
import type { Client, Product, Sale } from "@/lib/supabase/types"
import { useEffect } from "react" // Corrected import

const formSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  product_id: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  unit_price: z.coerce.number().min(0.01, "Unit price must be positive"),
  sale_date: z.string().min(1, "Sale date is required"),
  notes: z.string().max(255).optional().nullable(),
})

type SaleFormValues = z.infer<typeof formSchema>

interface SaleFormProps {
  initialData?: Sale | null
  clients: Client[]
  products: Product[]
}

export function SaleForm({ initialData, clients, products }: SaleFormProps) {
  const router = useRouter()
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      client_id: clients[0]?.id || "",
      product_id: products[0]?.id || "",
      quantity: 1,
      unit_price: 0,
      sale_date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        sale_date: initialData.sale_date.split("T")[0], // Format date for input type="date"
      })
    }
  }, [initialData, form])

  async function onSubmit(values: SaleFormValues) {
    try {
      if (initialData) {
        await updateSale(initialData.id, values) // Use updateSale for existing data
        toast.success("Sale updated successfully.")
      } else {
        await createSale(values)
        toast.success("Sale created successfully.")
      }
      router.push("/sales")
    } catch (error: any) {
      toast.error("Failed to save sale.", {
        description: error.message || "An unexpected error occurred.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
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
          name="product_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
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
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unit_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sale_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sale Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{initialData ? "Update Sale" : "Create Sale"}</Button>
      </form>
    </Form>
  )
}
