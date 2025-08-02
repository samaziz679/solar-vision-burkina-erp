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
import type { Product, Client } from "@/lib/supabase/types"
import { updateSale } from "@/app/sales/actions"
import type { SaleWithDetails } from "@/lib/data/sales" // Import the extended type

interface EditSaleFormProps {
  sale: SaleWithDetails
  products: Product[]
  clients?: Client[] // Clients will be added later
}

export default function EditSaleForm({ sale, products /*, clients */ }: EditSaleFormProps) {
  const router = useRouter()
  const [state, formAction, isPending] = useFormState(updateSale, { error: null, success: false })

  const [selectedProductId, setSelectedProductId] = useState<string>(sale.product_id)
  const [quantity, setQuantity] = useState<number>(sale.quantity)
  const [pricePlan, setPricePlan] = useState<"detail_1" | "detail_2" | "gros">(sale.price_plan)
  const [unitPrice, setUnitPrice] = useState<number>(sale.unit_price)
  const [totalPrice, setTotalPrice] = useState<number>(sale.total)
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(sale.client_id || undefined)
  const [notes, setNotes] = useState<string>(sale.notes || "")

  const currentProduct = products.find((p) => p.id === selectedProductId)

  useEffect(() => {
    if (currentProduct) {
      let price = 0
      switch (pricePlan) {
        case "detail_1":
          price = currentProduct.prix_vente_detail_1
          break
        case "detail_2":
          price = currentProduct.prix_vente_detail_2
          break
        case "gros":
          price = currentProduct.prix_vente_gros
          break
      }
      setUnitPrice(price)
      setTotalPrice(price * quantity)
    } else {
      setUnitPrice(0)
      setTotalPrice(0)
    }
  }, [selectedProductId, quantity, pricePlan, currentProduct])

  useEffect(() => {
    if (state?.success) {
      router.push("/sales") // Redirect to sales list on success
    }
  }, [state, router])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Modifier la vente</CardTitle>
        <CardDescription>Mettez à jour les détails de la vente.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={sale.id} />

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

          {/* Quantity and Price Plan */}
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
              <Label htmlFor="price_plan">Plan de prix</Label>
              <Select
                name="price_plan"
                value={pricePlan}
                onValueChange={(value: "detail_1" | "detail_2" | "gros") => setPricePlan(value)}
                disabled={isPending}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un plan de prix" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="detail_1">Détail 1</SelectItem>
                  <SelectItem value="detail_2">Détail 2</SelectItem>
                  <SelectItem value="gros">Gros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Unit Price and Total Price (Display Only) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Prix Unitaire (FCFA)</Label>
              <Input type="text" value={unitPrice.toLocaleString("fr-FR")} readOnly disabled />
              <input type="hidden" name="unit_price" value={unitPrice} />
            </div>
            <div>
              <Label>Total (FCFA)</Label>
              <Input type="text" value={totalPrice.toLocaleString("fr-FR")} readOnly disabled />
              <input type="hidden" name="total" value={totalPrice} />
            </div>
          </div>

          {/* Client Selection (Placeholder for now) */}
          <div>
            <Label htmlFor="client_id">Client</Label>
            <Select
              name="client_id"
              value={selectedClientId}
              onValueChange={(value) => setSelectedClientId(value)}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                {/* {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))} */}
                <SelectItem value="none">Aucun client</SelectItem> {/* Option for no client */}
                <SelectItem value="new-client">Ajouter un nouveau client (à venir)</SelectItem>
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

          <Button type="submit" className="w-full" disabled={isPending || !selectedProductId || quantity <= 0}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Mettre à jour la vente
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

