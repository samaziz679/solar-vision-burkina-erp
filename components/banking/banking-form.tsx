"use client"

import { useFormState } from "react-dom"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createBankingAccount, updateBankingAccount, type State } from "@/app/banking/actions"
import type { BankingAccount } from "@/lib/supabase/types"
import { toast } from "sonner"

interface BankingFormProps {
  bankingAccount?: BankingAccount
}

export default function BankingForm({ bankingAccount }: BankingFormProps) {
  const initialState: State = { message: null, errors: {} }
  const updateBankingAccountWithId = updateBankingAccount.bind(null, bankingAccount?.id || "")
  const [state, formAction] = useFormState(
    bankingAccount ? updateBankingAccountWithId : createBankingAccount,
    initialState,
  )

  if (state?.message) {
    if (state.message.includes("Failed")) {
      toast.error(state.message)
    } else {
      toast.success(state.message)
    }
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={bankingAccount?.id} />
      <div className="grid gap-2">
        <Label htmlFor="bank_name">Bank Name</Label>
        <Input
          id="bank_name"
          name="bank_name"
          type="text"
          defaultValue={bankingAccount?.bank_name || ""}
          required
          aria-describedby="bank-name-error"
        />
        {state?.errors?.bank_name && (
          <div id="bank-name-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.bank_name.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="account_name">Account Name</Label>
        <Input
          id="account_name"
          name="account_name"
          type="text"
          defaultValue={bankingAccount?.account_name || ""}
          required
          aria-describedby="account-name-error"
        />
        {state?.errors?.account_name && (
          <div id="account-name-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.account_name.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="account_number">Account Number</Label>
        <Input
          id="account_number"
          name="account_number"
          type="text"
          defaultValue={bankingAccount?.account_number || ""}
          required
          aria-describedby="account-number-error"
        />
        {state?.errors?.account_number && (
          <div id="account-number-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.account_number.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="balance">Balance</Label>
        <Input
          id="balance"
          name="balance"
          type="number"
          step="0.01"
          defaultValue={bankingAccount?.balance || 0}
          required
          aria-describedby="balance-error"
        />
        {state?.errors?.balance && (
          <div id="balance-error" aria-live="polite" className="text-sm text-red-500">
            {state.errors.balance.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
      <Button type="submit" className="w-full">
        {bankingAccount ? "Update Account" : "Create Account"}
      </Button>
    </form>
  )
}
