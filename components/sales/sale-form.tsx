"use client"

import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createSale } from "@/app/sales/actions"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import type { Client } from "@/lib/supabase/types"
import type { ProductForSale } from "@/lib/data/products" // Use the new type

interface SaleFormProps {
  products: ProductForSale[] // Update prop type
  clients: Client[]
}

export default function SaleForm({ products, clients }: SaleFormProps) {
  const initialState = { message: "", errors: {} }
  const [state, dispatch] = useFormState(createSale, initialState)
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [selectedPriceType, setSelectedPriceType] = useState<string>("")
  const [unitPrice, setUnitPrice] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [totalAmount, setTotalAmount] = useState<number>(0)

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  useEffect(() => {
    if (selectedProduct) {
      let price = 0
      if (selectedPriceType === "prix_vente_detail_1") {
        price = selectedProduct.prix_vente_detail_1 ?? 0
      } else if (selectedPriceType === "prix_vente_detail_2") {
        price = selectedProduct.prix_vente_detail_2 ?? 0
      } else if (selectedPriceType === "prix_vente_gros") {
        price = selectedProduct.prix_vente_gros ?? 0
      }
      setUnitPrice(price)
    } else {
      setUnitPrice(0)
    }
  }, [selectedProductId, selectedPriceType, selectedProduct])

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

        {/* Price Type Selection */}
        <div className="grid gap-2">
          <Label htmlFor="price_type">Price Type</Label>
          <Select name="price_type" onValueChange={setSelectedPriceType} disabled={!selectedProductId}>
            <SelectTrigger>
              <SelectValue placeholder="Select price type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prix_vente_detail_1">Retail Price 1</SelectItem>
              <SelectItem value="prix_vente_detail_2">Retail Price 2</SelectItem>
              <SelectItem value="prix_vente_gros">Wholesale Price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Unit Price */}
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

        {/* Client Selection */}
        <div className="grid gap-2">
          <Label htmlFor="client_id">Client</Label>
          <Select name="client_id">
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
          {state.errors?.client_id && <p className="text-sm font-medium text-destructive">{state.errors.client_id}</p>}
        </div>

        {/* Sale Date */}
        <div className="grid gap-2">
          <Label htmlFor="sale_date">Sale Date</Label>
          <Input id="sale_date" name="sale_date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
          {state.errors?.sale_date && <p className="text-sm font-medium text-destructive">{state.errors.sale_date}</p>}
        </div>

        <Button type="submit" className="w-full">
          Create Sale
        </Button>
      </div>
    </form>
  )
}
