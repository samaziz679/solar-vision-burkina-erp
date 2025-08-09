"use client"

import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createPurchase } from "@/app/purchases/actions"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import type { Supplier } from "@/lib/supabase/types"
import type { ProductForPurchase } from "@/lib/data/products" // Use the new type

interface PurchaseFormProps {
  products: ProductForPurchase[] // Update prop type
  suppliers: Supplier[]
}

export default function PurchaseForm({ products, suppliers }: PurchaseFormProps) {
  const initialState = { message: "", errors: {} }
  const [state, dispatch] = useFormState(createPurchase, initialState)
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [unitPrice, setUnitPrice] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [totalAmount, setTotalAmount] = useState<number>(0)

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  useEffect(() => {
    if (selectedProduct) {
      setUnitPrice(selectedProduct.prix_achat ?? 0)
    } else {
      setUnitPrice(0)
    }
  }, [selectedProductId, selectedProduct])

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
        {/* Product Selection */}
        <div className="grid gap-2">
          <Label htmlFor="product_id">Product</Label>
          <Select name="product_id" onValueChange={setSelectedProductId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {state.errors?.product_id && (
            <p className="text-sm font-medium text-destructive">{state.errors.product_id}</p>
          )}
        </div>

        {/* Unit Price (from product's prix_achat) */}
        <div className="grid gap-2">
          <Label htmlFor="unit_price">Unit Price</Label>
          <Input id="unit_price" name="unit_price" type="number" value={unitPrice} readOnly />
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

        {/* Total Amount */}
        <div className="grid gap-2">
          <Label htmlFor="total_amount">Total Amount</Label>
          <Input id="total_amount" name="total_amount" type="number" value={totalAmount} readOnly />
          {state.errors?.total_amount && (
            <p className="text-sm font-medium text-destructive">{state.errors.total_amount}</p>
          )}
        </div>

        {/* Supplier Selection */}
        <div className="grid gap-2">
          <Label htmlFor="supplier_id">Supplier</Label>
          <Select name="supplier_id">
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
          {state.errors?.supplier_id && (
            <p className="text-sm font-medium text-destructive">{state.errors.supplier_id}</p>
          )}
        </div>

        {/* Purchase Date */}
        <div className="grid gap-2">
          <Label htmlFor="purchase_date">Purchase Date</Label>
          <Input
            id="purchase_date"
            name="purchase_date"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
          />
          {state.errors?.purchase_date && (
            <p className="text-sm font-medium text-destructive">{state.errors.purchase_date}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Create Purchase
        </Button>
      </div>
    </form>
  )
}
