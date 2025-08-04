"use client"

import { useActionState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useEffect } from "react"
import { createPurchase } from "@/app/purchases/actions"
import type { Product, Supplier } from "@/lib/supabase/types"

interface PurchaseFormProps {
  products: Product[]
  suppliers: Supplier[]
}

export default function PurchaseForm({ products, suppliers }: PurchaseFormProps) {
  const [state, formAction] = useActionState(createPurchase, {
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
        <CardTitle>Ajouter un nouvel achat</CardTitle>
        <CardDescription>Remplissez les détails du nouvel achat.</CardDescription>
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
            <Label htmlFor="supplier_id">Fournisseur</Label>
            <Select name="supplier_id" required>
              <SelectTrigger>
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
            {state.errors?.supplier_id && <p className="text-red-500 text-sm">{state.errors.supplier_id}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantité</Label>
              <Input id="quantity" name="quantity" type="number" defaultValue={1} required />
              {state.errors?.quantity && <p className="text-red-500 text-sm">{state.errors.quantity}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unit_cost">Coût Unitaire</Label>
              <Input id="unit_cost" name="unit_cost" type="number" step="0.01" defaultValue={0} required />
              {state.errors?.unit_cost && <p className="text-red-500 text-sm">{state.errors.unit_cost}</p>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="purchase_date">Date d&apos;achat</Label>
            <Input
              id="purchase_date"
              name="purchase_date"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              required
            />
            {state.errors?.purchase_date && <p className="text-red-500 text-sm">{state.errors.purchase_date}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Création..." : "Créer l'achat"}
          </Button>
          {state.message && !state.errors && <p className="text-green-500 text-sm mt-2">{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
