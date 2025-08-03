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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { createPurchase } from "@/app/purchases/actions"
import type { Tables } from "@/lib/supabase/types"

const formSchema = z.object({
  product_id: z.string().min(1, "Product is required."),
  supplier_id: z.string().min(1, "Supplier is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  purchase_date: z.date({
    required_error: "Purchase date is required.",
  }),
  total_cost: z.coerce.number().min(0.01, "Total cost must be positive."),
})

type PurchaseFormValues = z.infer<typeof formSchema>

interface PurchaseFormProps {
  products: Tables<"products">[]
  suppliers: Tables<"suppliers">[]
}

export function PurchaseForm({ products, suppliers }: PurchaseFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(createPurchase, null)

  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_id: "",
      supplier_id: "",
      quantity: 1,
      purchase_date: new Date(),
      total_cost: 0,
    },
  })

  async function onSubmit(values: PurchaseFormValues) {
    const formData = new FormData()
    formData.append("product_id", values.product_id)
    formData.append("supplier_id", values.supplier_id)
    formData.append("quantity", values.quantity.toString())
    formData.append("purchase_date", format(values.purchase_date, "yyyy-MM-dd"))
    formData.append("total_cost", values.total_cost.toString())

    const result = await formAction(formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Purchase created successfully!")
      router.push("/purchases")
      router.refresh()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" step="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="purchase_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Purchase Date</FormLabel>
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
          name="total_cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Cost</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Create Purchase
        </Button>
      </form>
    </Form>
  )
}
