"use client"

import { useActionState, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Sale, Product, Client } from "@/lib/supabase/types"
import { createSale, updateSale } from "@/app/sales/actions"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface SaleFormProps {
  initialData?: Sale
  products: Product[]
  clients: Client[]
}

export function SaleForm({ initialData, products, clients }: SaleFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [selectedProduct, setSelectedProduct] = useState<string>(initialData?.product_id || "")
  const [selectedClient, setSelectedClient] = useState<string>(initialData?.client_id || "")
  const [saleDate, setSaleDate] = useState<Date | undefined>(initialData ? new Date(initialData.sale_date) : undefined)

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    if (!saleDate) {
      return { success: false, error: "Sale date is required." }
    }
    formData.set("sale_date", format(saleDate, "yyyy-MM-dd"))

    if (isEditing && initialData) {
      formData.set("original_quantity", initialData.quantity.toString()) // Pass original quantity for stock adjustment
      const result = await updateSale(initialData.id, formData)
      if (result.success) {
        toast.success("Sale updated successfully!")
        router.push("/sales")
      } else {
        toast.error(result.error)
      }
      return result
    } else {
      const result = await createSale(formData)
      if (result.success) {
        toast.success("Sale created successfully!")
        router.push("/sales")
      } else {
        toast.error(result.error)
      }
      return result
    }
  }, null)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="product_id">Product</Label>
        <Select name="product_id" value={selectedProduct} onValueChange={setSelectedProduct} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} (Stock: {product.stock})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="client_id">Client</Label>
        <Select name="client_id" value={selectedClient} onValueChange={setSelectedClient} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input id="quantity" name="quantity" type="number" defaultValue={initialData?.quantity} required />
      </div>
      <div>
        <Label htmlFor="unit_price">Unit Price</Label>
        <Input
          id="unit_price"
          name="unit_price"
          type="number"
          step="0.01"
          defaultValue={initialData?.unit_price}
          required
        />
      </div>
      <div>
        <Label htmlFor="sale_date">Sale Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full justify-start text-left font-normal", !saleDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {saleDate ? format(saleDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={saleDate} onSelect={setSaleDate} initialFocus />
          </PopoverContent>
        </Popover>
        <Input type="hidden" name="sale_date" value={saleDate ? format(saleDate, "yyyy-MM-dd") : ""} />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" defaultValue={initialData?.notes || ""} />
      </div>
      <Button type="submit" disabled={isPending}>
        {isEditing ? (isPending ? "Updating..." : "Update Sale") : isPending ? "Creating..." : "Create Sale"}
      </Button>
      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
    </form>
  )
}
