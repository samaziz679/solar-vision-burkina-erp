"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFormState, useFormStatus } from "react-dom"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBankEntry, updateBankEntry, type State } from "@/app/banking/actions"
import type { BankEntry } from "@/lib/supabase/types"
import { toast } from "sonner"

interface BankingFormProps {
  bankEntry?: BankEntry
}

export default function BankingForm({ bankEntry }: BankingFormProps) {
  const isEditing = !!bankEntry
  const initialState: State = { message: null, errors: {} }
  const [state, dispatch] = useFormState(
    isEditing ? updateBankEntry.bind(null, bankEntry.id) : createBankEntry,
    initialState,
  )
  const router = useRouter()

  useEffect(() => {
    if (state.message && !state.errors) {
      toast.success(state.message)
      router.push("/banking")
    } else if (state.message && state.errors) {
      toast.error(state.message)
    }
  }, [state, router])

  return (
    <form action={dispatch} className="grid gap-4">
      {isEditing && <input type="hidden" name="id" value={bankEntry.id} />}
      <div className="grid gap-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={bankEntry ? format(new Date(bankEntry.date), "yyyy-MM-dd") : ""}
          aria-describedby="date-error"
        />
        {state.errors?.date && (
          <p className="text-sm text-red-500" id="date-error">
            {state.errors.date.join(", ")}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={bankEntry?.description || ""}
          placeholder="Description de l'entrée bancaire"
          aria-describedby="description-error"
        />
        {state.errors?.description && (
          <p className="text-sm text-red-500" id="description-error">
            {state.errors.description.join(", ")}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="amount">Montant</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          defaultValue={bankEntry?.amount || ""}
          placeholder="0.00"
          aria-describedby="amount-error"
        />
        {state.errors?.amount && (
          <p className="text-sm text-red-500" id="amount-error">
            {state.errors.amount.join(", ")}
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="type">Type</Label>
        <Select name="type" defaultValue={bankEntry?.type || ""}>
          <SelectTrigger className="w-full" id="type" aria-describedby="type-error">
            <SelectValue placeholder="Sélectionner le type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deposit">Dépôt</SelectItem>
            <SelectItem value="withdrawal">Retrait</SelectItem>
          </SelectContent>
        </Select>
        {state.errors?.type && (
          <p className="text-sm text-red-500" id="type-error">
            {state.errors.type.join(", ")}
          </p>
        )}
      </div>
      <SubmitButton isEditing={isEditing} />
    </form>
  )
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending
        ? isEditing
          ? "Mise à jour..."
          : "Ajout..."
        : isEditing
          ? "Mettre à jour l'entrée"
          : "Ajouter l'entrée"}
    </Button>
  )
}
