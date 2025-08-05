"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Purchase, Product, Supplier } from "@/lib/supabase/types"
import { createPurchase, updatePurchase } from "@/app/purchases/actions"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface PurchaseFormProps {
  initialData?: Purchase
  products: Product[]
  suppliers: Supplier[]
}

export function PurchaseForm({ initialData, products, suppliers }: PurchaseFormProps) {
  const router = useRouter()
  const isEditing = !!initialData
  const [selectedProduct, setSelectedProduct] = useState<string>(initialData?.product_id || "")
  const [selectedSupplier, setSelectedSupplier] = useState<string>(initialData?.supplier_id || "")
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(
    initialData ? new Date(initialData.purchase_date) : undefined,
  )
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsPending(true)
    setError(null)

    if (!purchaseDate) {
      setError("Purchase date is required.")
      setIsPending(false)
      return
    }

    const formData = new FormData(event.currentTarget)
    formData.set("purchase_date", format(purchaseDate, "yyyy-MM-dd"))

    try {
      let result
      if (isEditing && initialData) {
        formData.set("original_quantity", initialData.quantity.toString()) // Pass original quantity for stock adjustment
        result = await updatePurchase(initialData.id, formData)
      } else {
        result = await createPurchase(formData)
      }

      if (result.success) {
        toast.success(isEditing ? "Purchase updated successfully!" : "Purchase created successfully!")
        router.push("/purchases")
      } else {
        toast.error(result.error)
        setError(result.error)
      }
    } catch (e: any) {
      toast.error("An unexpected error occurred.", { description: e.message })
      setError(e.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label htmlFor="supplier_id">Supplier</Label>
        <Select name="supplier_id" value={selectedSupplier} onValueChange={setSelectedSupplier} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a supplier" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((supplier) => (
              <SelectItem key={supplier.id} value={supplier.id}>
                {supplier.name}
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
        <Label htmlFor="purchase_date">Purchase Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full justify-start text-left font-normal", !purchaseDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {purchaseDate ? format(purchaseDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={purchaseDate} onSelect={setPurchaseDate} initialFocus />
          </PopoverContent>
        </Popover>
        <Input type="hidden" name="purchase_date" value={purchaseDate ? format(purchaseDate, "yyyy-MM-dd") : ""} />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" defaultValue={initialData?.notes || ""} />
      </div>
      <Button type="submit" disabled={isPending}>
        {isEditing ? (isPending ? "Updating..." : "Update Purchase") : isPending ? "Creating..." : "Create Purchase"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  )
}
