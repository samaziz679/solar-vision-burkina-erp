"use client"

import { useActionState, useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useEffect } from "react"
import { createBankingAccount, updateBankingAccount } from "@/app/banking/actions" // Corrected imports
import type { BankingAccount } from "@/lib/supabase/types"

interface BankingFormProps {
  initialData?: BankingAccount | null
}

export default function BankingForm({ initialData }: BankingFormProps) {
  const isEditing = !!initialData?.id
  const [state, formAction] = useActionState(
    isEditing ? updateBankingAccount.bind(null, initialData.id!) : createBankingAccount,
    {
      message: "",
      errors: undefined,
    },
  )
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
        <CardTitle>{isEditing ? "Modifier le compte bancaire" : "Ajouter un nouveau compte bancaire"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Mettez à jour les informations de ce compte bancaire."
            : "Remplissez les détails du nouveau compte bancaire."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="account_name">Nom du compte</Label>
            <Input id="account_name" name="account_name" defaultValue={initialData?.account_name || ""} required />
            {state.errors?.account_name && <p className="text-red-500 text-sm">{state.errors.account_name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="account_number">Numéro de compte</Label>
            <Input
              id="account_number"
              name="account_number"
              defaultValue={initialData?.account_number || ""}
              required
            />
            {state.errors?.account_number && <p className="text-red-500 text-sm">{state.errors.account_number}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bank_name">Nom de la banque</Label>
            <Input id="bank_name" name="bank_name" defaultValue={initialData?.bank_name || ""} required />
            {state.errors?.bank_name && <p className="text-red-500 text-sm">{state.errors.bank_name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="balance">Solde</Label>
            <Input
              id="balance"
              name="balance"
              type="number"
              step="0.01"
              defaultValue={initialData?.balance || 0}
              required
            />
            {state.errors?.balance && <p className="text-red-500 text-sm">{state.errors.balance}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending
              ? isEditing
                ? "Mise à jour..."
                : "Création..."
              : isEditing
                ? "Mettre à jour le compte"
                : "Créer le compte"}
          </Button>
          {state.message && !state.errors && <p className="text-green-500 text-sm mt-2">{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
