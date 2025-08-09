"use client"

import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePurchase } from "@/app/purchases/actions"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import type { Purchase, Supplier } from "@/lib/supabase/types"
import type { ProductForPurchase } from "@/lib/data/products" // Use the new type

interface EditPurchaseFormProps {
  purchase: Purchase
  products: ProductForPurchase[] // Update prop type
  suppliers: Supplier[]
}

export default function EditPurchaseForm({ purchase, products, suppliers }: EditPurchaseFormProps) {
  const initialState = { message: "", errors: {} }
  const updatePurchaseWithId = updatePurchase.bind(null, purchase.id)
  const [state, dispatch] = useFormState(updatePurchaseWithId, initialState)

  const [quantity, setQuantity] = useState<number>(purchase.quantity)
  const [unitPrice, setUnitPrice] = useState<number>(0)
  const [totalAmount, setTotalAmount] = useState<number>(purchase.total_amount)

  const selectedProduct = products.find((p) => p.id === purchase.product_id)

  useEffect(() => {
    if (selectedProduct) {
      // In an edit form, the price is fixed from the original purchase.
      // We calculate it for display but it's not editable.
      const originalUnitPrice = purchase.total_amount / purchase.quantity
      setUnitPrice(originalUnitPrice)
    }
  }, [selectedProduct, purchase])

  useEffect(() => {
    setTotalAmount(unitPrice * quantity)
  }, [unitPrice, quantity])

  useEffect(() => {
    if (state?.message) {
      if (state.errors) {
        toast.error(state.message)
      } else {
        toast.success(state.message)
      }
    }
  }, [state])

  return (
    <form action={dispatch}>
      <div className="grid gap-4">
        {/* Product (read-only) */}
        <div className="grid gap-2">
          <Label>Product</Label>
          <Input value={selectedProduct?.name ?? "Loading..."} readOnly disabled />
          <input type="hidden" name="product_id" value={purchase.product_id} />
        </div>

        {/* Unit Price (read-only) */}
        <div className="grid gap-2">
          <Label>Unit Price</Label>
          <Input type="number" value={unitPrice.toFixed(2)} readOnly disabled />
        </div>

        {/* Quantity */}
        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
          />
          {state.errors?.quantity && <p className="text-sm font-medium text-destructive">{state.errors.quantity}</p>}
        </div>

        {/* Total Amount (read-only) */}
        <div className="grid gap-2">
          <Label htmlFor="total_amount">Total Amount</Label>
          <Input id="total_amount" name="total_amount" type="number" value={totalAmount} readOnly />
          {state.errors?.total_amount && (
            <p className="text-sm font-medium text-destructive">{state.errors.total_amount}</p>
          )}
        </div>

        {/* Supplier (read-only) */}
        <div className="grid gap-2">
          <Label>Supplier</Label>
          <Input value={suppliers.find((s) => s.id === purchase.supplier_id)?.name ?? "Loading..."} readOnly disabled />
          <input type="hidden" name="supplier_id" value={purchase.supplier_id} />
        </div>

        {/* Purchase Date */}
        <div className="grid gap-2">
          <Label htmlFor="purchase_date">Purchase Date</Label>
          <Input
            id="purchase_date"
            name="purchase_date"
            type="date"
            defaultValue={new Date(purchase.purchase_date).toISOString().split("T")[0]}
          />
          {state.errors?.purchase_date && (
            <p className="text-sm font-medium text-destructive">{state.errors.purchase_date}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Update Purchase
        </Button>
      </div>
    </form>
  )
}
