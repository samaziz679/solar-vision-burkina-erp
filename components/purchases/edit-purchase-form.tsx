"use client"

import { useActionState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Purchase, Product, Supplier } from "@/lib/supabase/types"
import { updatePurchase } from "@/app/purchases/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useEffect } from "react"

interface EditPurchaseFormProps {
  purchase: Purchase
  products: Product[]
  suppliers: Supplier[]
}

export default function EditPurchaseForm({ purchase, products, suppliers }: EditPurchaseFormProps) {
  const [state, formAction] = useActionState(updatePurchase.bind(null, purchase.id), {
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
        <CardTitle>Modifier l&apos;achat</CardTitle>
        <CardDescription>Mettez à jour les détails de cet achat.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="product_id">Produit</Label>
            <Select name="product_id" defaultValue={purchase.product_id} required>
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
            <Select name="supplier_id" defaultValue={purchase.supplier_id} required>
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
              <Input id="quantity" name="quantity" type="number" defaultValue={purchase.quantity} required />
              {state.errors?.quantity && <p className="text-red-500 text-sm">{state.errors.quantity}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unit_cost">Coût Unitaire</Label>
              <Input
                id="unit_cost"
                name="unit_cost"
                type="number"
                step="0.01"
                defaultValue={purchase.unit_cost}
                required
              />
              {state.errors?.unit_cost && <p className="text-red-500 text-sm">{state.errors.unit_cost}</p>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="purchase_date">Date d&apos;achat</Label>
            <Input id="purchase_date" name="purchase_date" type="date" defaultValue={purchase.purchase_date} required />
            {state.errors?.purchase_date && <p className="text-red-500 text-sm">{state.errors.purchase_date}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Mise à jour..." : "Mettre à jour l'achat"}
          </Button>
          {state.message && !state.errors && <p className="text-green-500 text-sm mt-2">{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
