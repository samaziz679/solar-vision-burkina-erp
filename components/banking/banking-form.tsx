"use client"

import { useFormState, useFormStatus, type FormAction } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Banking } from "@/lib/supabase/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface BankingFormProps {
  action: FormAction
  initialData?: Banking
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Enregistrement..." : "Enregistrer la transaction"}
    </Button>
  )
}

export default function BankingForm({ action, initialData }: BankingFormProps) {
  const [state, formAction] = useFormState(action, {})
  const [date, setDate] = useState(initialData?.transaction_date ? new Date(initialData.transaction_date) : undefined)
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
        <Label htmlFor="transaction_date">Date de la transaction</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Choisir une date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
        <input type="hidden" name="transaction_date" value={date ? format(date, "yyyy-MM-dd") : ""} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="amount">Montant</Label>
        <Input id="amount" name="amount" type="number" step="0.01" defaultValue={initialData?.amount || ""} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="type">Type de transaction</Label>
        <Select name="type" defaultValue={initialData?.type || ""}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Dépôt">Dépôt</SelectItem>
            <SelectItem value="Retrait">Retrait</SelectItem>
            <SelectItem value="Transfert">Transfert</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select name="category" defaultValue={initialData?.category || ""}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Vente">Vente</SelectItem>
            <SelectItem value="Achat">Achat</SelectItem>
            <SelectItem value="Salaire">Salaire</SelectItem>
            <SelectItem value="Loyer">Loyer</SelectItem>
            <SelectItem value="Autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Description de la transaction"
          defaultValue={initialData?.description || ""}
          required
        />
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
