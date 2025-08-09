import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createBankingAccount, updateBankingAccount } from "@/app/banking/actions"
import type { BankingAccount } from "@/lib/supabase/types"

interface BankingFormProps {
  bankingAccount?: BankingAccount
}

export default function BankingForm({ bankingAccount }: BankingFormProps) {
  // When editing, bind the id so the Server Action receives it as the first argument.
  const formAction = bankingAccount ? updateBankingAccount.bind(null, bankingAccount.id) : createBankingAccount

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={bankingAccount?.id ?? ""} />

      <div className="grid gap-2">
        <Label htmlFor="bank_name">Bank Name</Label>
        <Input id="bank_name" name="bank_name" type="text" defaultValue={bankingAccount?.bank_name ?? ""} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="account_name">Account Name</Label>
        <Input
          id="account_name"
          name="account_name"
          type="text"
          defaultValue={bankingAccount?.account_name ?? ""}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="account_number">Account Number</Label>
        <Input
          id="account_number"
          name="account_number"
          type="text"
          defaultValue={bankingAccount?.account_number ?? ""}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="balance">Balance</Label>
        <Input
          id="balance"
          name="balance"
          type="number"
          step="0.01"
          defaultValue={bankingAccount?.balance ?? 0}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        {bankingAccount ? "Update Account" : "Create Account"}
      </Button>
    </form>
  )
}
