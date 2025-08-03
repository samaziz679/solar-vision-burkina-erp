"use client"

import { useFormState, useFormStatus, type FormAction } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Sale, Product, Client } from "@/lib/supabase/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

interface EditSaleFormProps {
  initialData: Sale
  products: Product[]
  clients: Client[]
  action: FormAction
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Mise à jour..." : "Mettre à jour la vente"}
    </Button>
  )
}

export default function EditSaleForm({ initialData, products, clients, action }: EditSaleFormProps) {
  const [state, formAction] = useFormState(action, {})

  return (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name="id" value={initialData.id} />
      <input type="hidden" name="old_quantity_sold" value={initialData.quantity_sold} />{" "}
      {/* Hidden field for old quantity */}
      <div className="grid gap-2">
        <Label htmlFor="product_id">Produit</Label>
        <Select name="product_id" defaultValue={initialData.product_id} required>
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
        <Label htmlFor="quantity_sold">Quantité Vendue</Label>
        <Input
          id="quantity_sold"
          name="quantity_sold"
          type="number"
          defaultValue={initialData.quantity_sold}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="unit_price">Prix Unitaire</Label>
        <Input
          id="unit_price"
          name="unit_price"
          type="number"
          step="0.01"
          defaultValue={initialData.unit_price}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sale_date">Date de Vente</Label>
        <Input id="sale_date" name="sale_date" type="date" defaultValue={initialData.sale_date} required />
      </div>
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="client_id">Client</Label>
        <Select name="client_id" defaultValue={initialData.client_id} required>
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
