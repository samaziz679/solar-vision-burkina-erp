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
import { createProduct } from "@/app/inventory/actions"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  category: z.string().optional(),
  cost_price: z.coerce.number().min(0.01, "Cost price must be positive."),
  selling_price: z.coerce.number().min(0.01, "Selling price must be positive."),
  quantity_in_stock: z.coerce.number().min(0, "Quantity cannot be negative."),
  image_url: z.string().url("Invalid URL").optional().or(z.literal("")),
})

type ProductFormValues = z.infer<typeof formSchema>

export function ProductForm() {
  const router = useRouter()
  const [state, formAction] = useActionState(createProduct, null)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      cost_price: 0,
      selling_price: 0,
      quantity_in_stock: 0,
      image_url: "",
    },
  })

  async function onSubmit(values: ProductFormValues) {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("description", values.description || "")
    formData.append("category", values.category || "")
    formData.append("cost_price", values.cost_price.toString())
    formData.append("selling_price", values.selling_price.toString())
    formData.append("quantity_in_stock", values.quantity_in_stock.toString())
    formData.append("image_url", values.image_url || "")

    const result = await formAction(formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Product created successfully!")
      router.push("/inventory")
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
          name="cost_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="selling_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selling Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity_in_stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity in Stock</FormLabel>
              <FormControl>
                <Input type="number" step="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Create Product
        </Button>
      </form>
    </Form>
  )
}
