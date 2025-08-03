"use client"

import { useState, useEffect } from "react"
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import type { Product, Supplier } from "@/lib/supabase/types"
import { updatePurchase } from "@/app/purchases/actions"
import type { PurchaseWithDetails } from "@/lib/data/purchases"

interface EditPurchaseFormProps {
  purchase: PurchaseWithDetails
  products: Product[]
  suppliers: Supplier[]
}

export default function EditPurchaseForm({ purchase, products, suppliers }: EditPurchaseFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useFormState(updatePurchase, { error: null, success: false })

  const [selectedProductId, setSelectedProductId] = useState<string>(purchase.product_id)
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | undefined>(purchase.supplier_id || undefined)
  const [quantity, setQuantity] = useState<number>(purchase.quantity)
  const [unitPrice, setUnitPrice] = useState<number>(purchase.unit_price)
  const [totalPrice, setTotalPrice] = useState<number>(purchase.total)
  const [notes, setNotes] = useState<string>(purchase.notes || "")

  const currentProduct = products.find((p) => p.id === selectedProductId)

  useEffect(() => {
    // Recalculate total price based on quantity and unit price
    setTotalPrice(unitPrice * quantity)
  }, [quantity, unitPrice])

  useEffect(() => {
    if (state?.success) {
      router.push("/purchases") // Redirect to purchases list on success
    }
  }, [state, router])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Modifier l'achat</CardTitle>
        <CardDescription>Mettez à jour les détails de l'achat.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={purchase.id} />

          {/* Product Selection */}
          <div>
            <Label htmlFor="product_id">Produit</Label>
            <Select
              name="product_id"
              value={selectedProductId}
              onValueChange={(value) => setSelectedProductId(value)}
              disabled={isPending}
              required
            >
              <SelectTrigger>
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

          {/* Quantity and Unit Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
                required
                disabled={isPending}
              />
            </div>
            <div>
              <Label htmlFor="unit_price">Prix Unitaire (FCFA)</Label>
              <Input
                id="unit_price"
                name="unit_price"
                type="number"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                min={0}
                required
                disabled={isPending}
              />
            </div>
          </div>

          {/* Total Price (Display Only) */}
          <div>
            <Label>Total (FCFA)</Label>
            <Input type="text" value={totalPrice.toLocaleString("fr-FR")} readOnly disabled />
            <input type="hidden" name="total" value={totalPrice} />
          </div>

          {/* Supplier Selection */}
          <div>
            <Label htmlFor="supplier_id">Fournisseur</Label>
            <Select
              name="supplier_id"
              value={selectedSupplierId}
              onValueChange={(value) => setSelectedSupplierId(value === "none" ? undefined : value)}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un fournisseur (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun fournisseur</SelectItem>
                {suppliers?.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes (Optional) */}
          <div>
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Input
              id="notes"
              name="notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isPending}
            />
          </div>

          {state?.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          {state?.success && (
            <Alert>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !selectedProductId || quantity <= 0 || unitPrice < 0}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Mettre à jour l'achat
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
