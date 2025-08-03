"use client"

import { useFormState } from "react-dom"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save } from "lucide-react"
import { createSupplier, updateSupplier } from "@/app/suppliers/actions" // Will be created next
import type { Supplier } from "@/lib/supabase/types"

interface SupplierFormProps {
  supplier?: Supplier // Optional prop for editing existing suppliers
}

export default function SupplierForm({ supplier }: SupplierFormProps) {
  const router = useRouter()
  const isEditing = !!supplier

  // Determine which action to use based on whether we're editing or creating
  const action = isEditing ? updateSupplier : createSupplier
  const [state, formAction, isPending] = useFormState(action, { error: null, success: false })

  // Redirect on success
  if (state?.success) {
    router.push("/suppliers")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Modifier le fournisseur" : "Ajouter un nouveau fournisseur"}</CardTitle>
        <CardDescription>
          {isEditing ? "Mettez à jour les détails du fournisseur." : "Remplissez les détails du nouveau fournisseur."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {isEditing && <input type="hidden" name="id" value={supplier.id} />}

          <div>
            <Label htmlFor="name">Nom du fournisseur</Label>
            <Input
              id="name"
              name="name"
              type="text"
              defaultValue={supplier?.name || ""}
              required
              disabled={isPending}
            />
          </div>
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={supplier?.phone || ""}
              placeholder="Ex: +226 70 12 34 56"
              disabled={isPending}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={supplier?.email || ""}
              placeholder="Ex: fournisseur@example.com"
              disabled={isPending}
            />
          </div>
          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              name="address"
              type="text"
              defaultValue={supplier?.address || ""}
              placeholder="Ex: Zone Industrielle, Ouagadougou"
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
                {isEditing ? "Mise à jour..." : "Ajout en cours..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Mettre à jour le fournisseur" : "Ajouter le fournisseur"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
