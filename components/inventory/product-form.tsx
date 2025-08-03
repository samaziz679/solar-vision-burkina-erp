"use client" // Marks this component as a Client Component

import { useFormState, useFormStatus, type FormAction } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product } from "@/lib/supabase/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { useState, useEffect } from "react"

interface ProductFormProps {
  action: FormAction
  initialData?: Product
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Enregistrement..." : "Enregistrer le produit"}
    </Button>
  )
}

export default function ProductForm({ action, initialData }: ProductFormProps) {
  const [isClient, setIsClient] = useState(false) // State to track if component is mounted on client
  const [state, formAction] = useFormState(action, {})

  useEffect(() => {
    setIsClient(true) // Set to true once component mounts on client
  }, [])

  if (!isClient) {
    return <div>Chargement du formulaire...</div> // Render a loading state on the server
  }

  return (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <div className="grid gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" type="text" defaultValue={initialData?.name || ""} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="quantity">Quantité</Label>
        <Input id="quantity" name="quantity" type="number" defaultValue={initialData?.quantity || ""} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="unit">Unité</Label>
        <Input id="unit" name="unit" type="text" defaultValue={initialData?.unit || ""} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="type">Type</Label>
        <Select name="type" defaultValue={initialData?.type || ""}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Sélectionner le type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Panneau Solaire">Panneau Solaire</SelectItem>
            <SelectItem value="Batterie">Batterie</SelectItem>
            <SelectItem value="Onduleur">Onduleur</SelectItem>
            <SelectItem value="Accessoire">Accessoire</SelectItem>
            <SelectItem value="Autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="prix_achat">Prix d'achat</Label>
        <Input
          id="prix_achat"
          name="prix_achat"
          type="number"
          step="0.01"
          defaultValue={initialData?.prix_achat || ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="prix_vente_detail_1">Prix de vente (Détail 1)</Label>
        <Input
          id="prix_vente_detail_1"
          name="prix_vente_detail_1"
          type="number"
          step="0.01"
          defaultValue={initialData?.prix_vente_detail_1 || ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="prix_vente_detail_2">Prix de vente (Détail 2)</Label>
        <Input
          id="prix_vente_detail_2"
          name="prix_vente_detail_2"
          type="number"
          step="0.01"
          defaultValue={initialData?.prix_vente_detail_2 || ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="prix_vente_gros">Prix de vente (Gros)</Label>
        <Input
          id="prix_vente_gros"
          name="prix_vente_gros"
          type="number"
          step="0.01"
          defaultValue={initialData?.prix_vente_gros || ""}
        />
      </div>
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Description du produit"
          defaultValue={initialData?.description || ""}
        />
      </div>
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="image">URL de l'image</Label>
        <Input
          id="image"
          name="image"
          type="url"
          placeholder="https://example.com/image.jpg"
          defaultValue={initialData?.image || ""}
        />
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
