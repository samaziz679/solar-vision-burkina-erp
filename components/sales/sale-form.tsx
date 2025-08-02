"use client"

import { useFormState, useFormStatus, type FormAction } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Product, Client, Sale } from "@/lib/supabase/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"

interface SaleFormProps {
  action: FormAction
  initialData?: Sale
  products: Product[]
  clients: Client[]
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Enregistrement..." : "Enregistrer la vente"}
    </Button>
  )
}

export default function SaleForm({ action, initialData, products, clients }: SaleFormProps) {
  const [state, formAction] = useFormState(action, {})
  const [selectedProductId, setSelectedProductId] = useState(initialData?.product_id || "")
  const [quantity, setQuantity] = useState(initialData?.quantity_sold || 0)
  const [unitPrice, setUnitPrice] = useState(initialData?.unit_price || 0)
  const [totalPrice, setTotalPrice] = useState(initialData?.total_price || 0)

  useEffect(() => {
    const product = products.find((p) => p.id === selectedProductId)
    if (product) {
      // Default to detail price 1, or adjust based on your logic
      setUnitPrice(product.prix_vente_detail_1 || 0)
    } else {
      setUnitPrice(0)
    }
  }, [selectedProductId, products])

  useEffect(() => {
    if (quantity > 0 && unitPrice > 0) {
      setTotalPrice(quantity * unitPrice)
    } else {
      setTotalPrice(0)
    }
  }, [quantity, unitPrice])

  return (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <div className="grid gap-2">
        <Label htmlFor="sale_date">Date de vente</Label>
        <Input
          id="sale_date"
          name="sale_date"
          type="date"
          defaultValue={initialData?.sale_date || new Date().toISOString().split("T")[0]}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="product_id">Produit</Label>
        <Select name="product_id" value={selectedProductId} onValueChange={setSelectedProductId} required>
          <SelectTrigger id="product_id">
            <SelectValue placeholder="Sélectionner un produit" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} (Stock: {product.quantity})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="client_id">Client</Label>
        <Select name="client_id" defaultValue={initialData?.client_id || ""} required>
          <SelectTrigger id="client_id">
            <SelectValue placeholder="Sélectionner un client" />
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
      <div className="grid gap-2">
        <Label htmlFor="quantity_sold">Quantité vendue</Label>
        <Input
          id="quantity_sold"
          name="quantity_sold"
          type="number"
          defaultValue={initialData?.quantity_sold || ""}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="unit_price">Prix unitaire</Label>
        <Input
          id="unit_price"
          name="unit_price"
          type="number"
          step="0.01"
          value={unitPrice}
          onChange={(e) => setUnitPrice(Number(e.target.value))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="total_price">Prix total</Label>
        <Input id="total_price" name="total_price" type="number" step="0.01" value={totalPrice} readOnly required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="payment_status">Statut du paiement</Label>
        <Select name="payment_status" defaultValue={initialData?.payment_status || "pending"} required>
          <SelectTrigger id="payment_status">
            <SelectValue placeholder="Sélectionner le statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="paid">Payé</SelectItem>
            <SelectItem value="partially_paid">Partiellement payé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" placeholder="Notes sur la vente" defaultValue={initialData?.notes || ""} />
      </div>
      {state?.error && (
        <Alert variant="destructive" className="md:col-span-2">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      <div className="md:col-span-2 flex justify-end">
        <SubmitButton />
      </div>
    </form>
  )
}
