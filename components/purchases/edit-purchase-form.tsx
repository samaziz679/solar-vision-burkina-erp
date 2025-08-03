"use client"

import { useFormState, useFormStatus, type FormAction } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Product, Supplier, Purchase } from "@/lib/supabase/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"

interface EditPurchaseFormProps {
  initialData: Purchase
  products: Product[]
  suppliers: Supplier[]
  action: FormAction // Add action prop with FormAction type
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Mise à jour..." : "Mettre à jour l'achat"}
    </Button>
  )
}

export default function EditPurchaseForm({ initialData, products, suppliers, action }: EditPurchaseFormProps) {
  const [state, formAction] = useFormState(action, {}) // Update the useFormState call to pass `action`
  const [selectedProductId, setSelectedProductId] = useState(initialData?.product_id || "")
  const [quantity, setQuantity] = useState(initialData?.quantity_purchased || 0)
  const [unitCost, setUnitCost] = useState(initialData?.unit_cost || 0)
  const [totalCost, setTotalCost] = useState(initialData?.total_cost || 0)

  useEffect(() => {
    if (quantity > 0 && unitCost > 0) {
      setTotalCost(quantity * unitCost)
    } else {
      setTotalCost(0)
    }
  }, [quantity, unitCost])

  return (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="id" value={initialData.id} />
      <div className="grid gap-2">
        <Label htmlFor="purchase_date">Date d'achat</Label>
        <Input id="purchase_date" name="purchase_date" type="date" defaultValue={initialData.purchase_date} required />
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
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="supplier_id">Fournisseur</Label>
        <Select name="supplier_id" defaultValue={initialData.supplier_id || ""} required>
          <SelectTrigger id="supplier_id">
            <SelectValue placeholder="Sélectionner un fournisseur" />
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
      <div className="grid gap-2">
        <Label htmlFor="quantity_purchased">Quantité achetée</Label>
        <Input
          id="quantity_purchased"
          name="quantity_purchased"
          type="number"
          defaultValue={initialData.quantity_purchased}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="unit_cost">Coût unitaire</Label>
        <Input
          id="unit_cost"
          name="unit_cost"
          type="number"
          step="0.01"
          defaultValue={initialData.unit_cost}
          onChange={(e) => setUnitCost(Number(e.target.value))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="total_cost">Coût total</Label>
        <Input id="total_cost" name="total_cost" type="number" step="0.01" value={totalCost} readOnly required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="payment_status">Statut du paiement</Label>
        <Select name="payment_status" defaultValue={initialData.payment_status} required>
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
        <Textarea id="notes" name="notes" placeholder="Notes sur l'achat" defaultValue={initialData.notes || ""} />
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
