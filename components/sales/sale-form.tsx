"use client"

import { useFormState, useFormStatus, type FormAction } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Sale } from "@/lib/supabase/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface SaleFormProps {
  action: FormAction
  initialData?: Sale
  clients: { id: string; name: string }[]
  products: { id: string; name: string }[]
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Enregistrement..." : "Enregistrer la vente"}
    </Button>
  )
}

export default function SaleForm({ action, initialData, clients, products }: SaleFormProps) {
  const [state, formAction] = useFormState(action, {})
  const [saleDate, setSaleDate] = useState(initialData?.sale_date ? new Date(initialData.sale_date) : undefined)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div>Chargement du formulaire...</div>
  }

  return (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <div className="grid gap-2">
        <Label htmlFor="sale_date">Date de vente</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full justify-start text-left font-normal", !saleDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {saleDate ? format(saleDate, "PPP") : <span>Choisir une date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={saleDate} onSelect={setSaleDate} initialFocus />
          </PopoverContent>
        </Popover>
        <input type="hidden" name="sale_date" value={saleDate ? format(saleDate, "yyyy-MM-dd") : ""} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="client_id">Client</Label>
        <Select name="client_id" defaultValue={initialData?.client_id || ""}>
          <SelectTrigger id="client_id">
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
      </div>
      <div className="grid gap-2">
        <Label htmlFor="product_id">Produit</Label>
        <Select name="product_id" defaultValue={initialData?.product_id || ""}>
          <SelectTrigger id="product_id">
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
      </div>
      <div className="grid gap-2">
        <Label htmlFor="quantity_sold">Quantité vendue</Label>
        <Input
          id="quantity_sold"
          name="quantity_sold"
          type="number"
          defaultValue={initialData?.quantity_sold || ""}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="unit_price">Prix unitaire</Label>
        <Input
          id="unit_price"
          name="unit_price"
          type="number"
          step="0.01"
          defaultValue={initialData?.unit_price || ""}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="total_price">Prix total</Label>
        <Input
          id="total_price"
          name="total_price"
          type="number"
          step="0.01"
          defaultValue={initialData?.total_price || ""}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="payment_status">Statut de paiement</Label>
        <Select name="payment_status" defaultValue={initialData?.payment_status || ""}>
          <SelectTrigger id="payment_status">
            <SelectValue placeholder="Sélectionner le statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Payé">Payé</SelectItem>
            <SelectItem value="En attente">En attente</SelectItem>
            <SelectItem value="Partiellement payé">Partiellement payé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" placeholder="Notes supplémentaires" defaultValue={initialData?.notes || ""} />
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
