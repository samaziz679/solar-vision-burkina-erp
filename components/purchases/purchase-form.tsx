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
import { createPurchase, updatePurchase } from "@/app/purchases/actions"
import type { Product, Purchase, Supplier } from "@/lib/supabase/types"
import { useEffect } from "react"

const formSchema = z.object({
  supplier_id: z.string().min(1, "Supplier is required"),
  product_id: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  unit_price: z.coerce.number().min(0.01, "Unit price must be positive"),
  purchase_date: z.string().min(1, "Purchase date is required"),
  notes: z.string().max(255).optional().nullable(),
})

type PurchaseFormValues = z.infer<typeof formSchema>

interface PurchaseFormProps {
  initialData?: Purchase | null
  suppliers: Supplier[]
  products: Product[]
}

export function PurchaseForm({ initialData, suppliers, products }: PurchaseFormProps) {
  const router = useRouter()
  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      supplier_id: suppliers[0]?.id || "",
      product_id: products[0]?.id || "",
      quantity: 1,
      unit_price: 0,
      purchase_date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        purchase_date: initialData.purchase_date.split("T")[0], // Format date for input type="date"
      })
    }
  }, [initialData, form])

  async function onSubmit(values: PurchaseFormValues) {
    try {
      if (initialData) {
        await updatePurchase(initialData.id, values)
        toast.success("Purchase updated successfully.")
      } else {
        await createPurchase(values)
        toast.success("Purchase created successfully.")
      }
      router.push("/purchases")
    } catch (error: any) {
      toast.error("Failed to save purchase.", {
        description: error.message || "An unexpected error occurred.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="supplier_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
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
          name="purchase_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase Date</FormLabel>
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
        <Button type="submit">{initialData ? "Update Purchase" : "Create Purchase"}</Button>
      </form>
    </Form>
  )
}
