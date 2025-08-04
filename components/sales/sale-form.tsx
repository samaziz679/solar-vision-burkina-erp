"use client"

import { useActionState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useEffect } from "react"
import { createSale } from "@/app/sales/actions"
import type { Product, Client } from "@/lib/supabase/types"

interface SaleFormProps {
  products: Product[]
  clients: Client[]
}

export default function SaleForm({ products, clients }: SaleFormProps) {
  const [state, formAction] = useActionState(createSale, {
    message: "",
    errors: undefined,
  })
  const { pending } = useFormStatus()

  useEffect(() => {
    if (state.message && !state.errors) {
      toast.success(state.message)
    } else if (state.message && state.errors) {
      toast.error("Erreur de validation", {
        description: state.message,
      })
    }
  }, [state])

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Ajouter une nouvelle vente</CardTitle>
        <CardDescription>Remplissez les détails de la nouvelle vente.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="product_id">Produit</Label>
            <Select name="product_id" required>
              <SelectTrigger>
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
            {state.errors?.product_id && <p className="text-red-500 text-sm">{state.errors.product_id}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="client_id">Client</Label>
            <Select name="client_id" required>
              <SelectTrigger>
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
            {state.errors?.client_id && <p className="text-red-500 text-sm">{state.errors.client_id}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantité</Label>
              <Input id="quantity" name="quantity" type="number" defaultValue={1} required />
              {state.errors?.quantity && <p className="text-red-500 text-sm">{state.errors.quantity}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unit_price">Prix Unitaire</Label>
              <Input id="unit_price" name="unit_price" type="number" step="0.01" defaultValue={0} required />
              {state.errors?.unit_price && <p className="text-red-500 text-sm">{state.errors.unit_price}</p>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sale_date">Date de vente</Label>
            <Input
              id="sale_date"
              name="sale_date"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              required
            />
            {state.errors?.sale_date && <p className="text-red-500 text-sm">{state.errors.sale_date}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Création..." : "Créer la vente"}
          </Button>
          {state.message && !state.errors && <p className="text-green-500 text-sm mt-2">{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
