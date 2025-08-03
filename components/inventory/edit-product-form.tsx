"use client"

import { useEffect } from "react" // Import useEffect
import { useFormState } from "react-dom"
import { useRouter } from "next/navigation" // Import useRouter
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save } from "lucide-react"
import { updateProduct } from "@/app/inventory/actions"
import type { Product } from "@/lib/supabase/types"

interface EditProductFormProps {
  product: Product
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const [state, formAction, isPending] = useFormState(updateProduct, { error: null, success: false }) // Initialize success state
  const router = useRouter() // Initialize useRouter

  useEffect(() => {
    if (state?.success) {
      router.push("/inventory") // Redirect on successful update
    }
  }, [state, router])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Modifier le produit</CardTitle>
        <CardDescription>Mettez à jour les détails du produit.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="id" value={product.id} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom du produit</Label>
              <Input id="name" name="name" type="text" defaultValue={product.name} required disabled={isPending} />
            </div>
            <div>
              <Label htmlFor="type">Type de produit</Label>
              <Input
                id="type"
                name="type"
                type="text"
                defaultValue={product.type || ""}
                placeholder="Ex: Panneau Solaire, Batterie"
                disabled={isPending}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                defaultValue={product.quantity}
                min={0}
                required
                disabled={isPending}
              />
            </div>
            <div>
              <Label htmlFor="seuil_stock_bas">Seuil de stock bas</Label>
              <Input
                id="seuil_stock_bas"
                name="seuil_stock_bas"
                type="number"
                defaultValue={product.seuil_stock_bas}
                min={0}
                required
                disabled={isPending}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="prix_achat">Prix d'achat (FCFA)</Label>
              <Input
                id="prix_achat"
                name="prix_achat"
                type="number"
                step="0.01"
                defaultValue={product.prix_achat}
                min={0}
                required
                disabled={isPending}
              />
            </div>
            <div>
              <Label htmlFor="prix_vente_detail_1">Prix Vente Détail 1 (FCFA)</Label>
              <Input
                id="prix_vente_detail_1"
                name="prix_vente_detail_1"
                type="number"
                step="0.01"
                defaultValue={product.prix_vente_detail_1}
                min={0}
                required
                disabled={isPending}
              />
            </div>
            <div>
              <Label htmlFor="prix_vente_detail_2">Prix Vente Détail 2 (FCFA)</Label>
              <Input
                id="prix_vente_detail_2"
                name="prix_vente_detail_2"
                type="number"
                step="0.01"
                defaultValue={product.prix_vente_detail_2}
                min={0}
                required
                disabled={isPending}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="prix_vente_gros">Prix Vente Gros (FCFA)</Label>
            <Input
              id="prix_vente_gros"
              name="prix_vente_gros"
              type="number"
              step="0.01"
              defaultValue={product.prix_vente_gros}
              min={0}
              required
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
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour en cours...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Mettre à jour le produit
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
