"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createPurchase, updatePurchase } from "@/app/purchases/actions"
import { useRouter } from "next/navigation"
import type { Purchase, Supplier, Product } from "@/lib/supabase/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  supplier_id: z.string().uuid({ message: "Supplier is required." }),
  purchase_date: z.date({
    required_error: "A purchase date is required.",
  }),
  status: z.string().min(1, { message: "Status is required." }),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid({ message: "Product is required." }),
        quantity: z.coerce.number().int().min(1, { message: "Quantity must be at least 1." }),
        unit_price: z.coerce.number().min(0.01, { message: "Unit price must be positive." }),
      }),
    )
    .min(1, { message: "At least one item is required." }),
})

type PurchaseFormProps = {
  initialData?: Purchase | null
  suppliers: Supplier[]
  products: Product[]
}

export function PurchaseForm({ initialData, suppliers, products }: PurchaseFormProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          purchase_date: new Date(initialData.purchase_date),
          items: initialData.items || [], // Ensure items is an array
        }
      : {
          supplier_id: "",
          purchase_date: new Date(),
          status: "Pending",
          notes: "",
          items: [{ product_id: "", quantity: 1, unit_price: 0 }],
        },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let error: string | null = null
    const dataToSubmit = {
      ...values,
      purchase_date: values.purchase_date.toISOString(),
      total_amount: values.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0),
    }

    if (initialData) {
      const result = await updatePurchase(initialData.id, dataToSubmit)
      error = result?.error
    } else {
      const result = await createPurchase(dataToSubmit)
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
        description: `Purchase ${initialData ? "updated" : "created"} successfully.`,
      })
      router.push("/purchases")
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
          name="purchase_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Purchase Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card>
          <CardHeader>
            <CardTitle>Purchase Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-b pb-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.product_id`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <Select onValueChange={itemField.onChange} defaultValue={itemField.value}>
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
                  name={`items.${index}.quantity`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...itemField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.unit_price`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Unit Price</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...itemField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="destructive" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ product_id: "", quantity: 1, unit_price: 0 })}
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Item
            </Button>
            <FormMessage>{form.formState.errors.items?.message}</FormMessage>
          </CardContent>
        </Card>

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
        <Button type="submit">{initialData ? "Update" : "Create"} Purchase</Button>
      </form>
    </Form>
  )
}
