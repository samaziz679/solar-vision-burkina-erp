"use client"

import { useActionState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Product } from "@/lib/supabase/types"
import { updateProduct } from "@/app/inventory/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useEffect } from "react"

interface EditProductFormProps {
  product: Product
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const [state, formAction] = useActionState(updateProduct.bind(null, product.id), {
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
        <CardTitle>Modifier le produit</CardTitle>
        <CardDescription>Mettez à jour les informations de ce produit.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom du produit</Label>
            <Input id="name" name="name" defaultValue={product.name} required />
            {state.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" name="stock" type="number" defaultValue={product.stock} required />
              {state.errors?.stock && <p className="text-red-500 text-sm">{state.errors.stock}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Catégorie</Label>
              <Input id="category" name="category" defaultValue={product.category} required />
              {state.errors?.category && <p className="text-red-500 text-sm">{state.errors.category}</p>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Prix</Label>
            <Input id="price" name="price" type="number" step="0.01" defaultValue={product.price} required />
            {state.errors?.price && <p className="text-red-500 text-sm">{state.errors.price}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={product.description || ""} />
            {state.errors?.description && <p className="text-red-500 text-sm">{state.errors.description}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image_url">URL de l&apos;image</Label>
            <Input id="image_url" name="image_url" type="url" defaultValue={product.image_url || ""} />
            {state.errors?.image_url && <p className="text-red-500 text-sm">{state.errors.image_url}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Mise à jour..." : "Mettre à jour le produit"}
          </Button>
          {state.message && !state.errors && <p className="text-green-500 text-sm mt-2">{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
