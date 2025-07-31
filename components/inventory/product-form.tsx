"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save } from "lucide-react"
import { createProduct } from "@/app/inventory/actions" // Import the Server Action

export default function ProductForm() {
  const [state, formAction, isPending] = useActionState(createProduct, null)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Ajouter un nouveau produit</CardTitle>
        <CardDescription>Remplissez les détails du nouveau produit pour l'ajouter à l'inventaire.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom du produit</Label>
              <Input id="name" name="name" type="text" required disabled={isPending} />
            </div>
            <div>
              <Label htmlFor="type">Type de produit</Label>
              <Input
                id="type"
                name="type"
                type="text"
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
                defaultValue={0}
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
                defaultValue={10}
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
                defaultValue={0}
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
                defaultValue={0}
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
                defaultValue={0}
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
              defaultValue={0}
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

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Ajouter le produit
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
