"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BankingAccount } from "@/lib/supabase/types"
import { createBankingAccount, updateBankingAccount } from "@/app/banking/actions"
import { toast } from "sonner"

interface BankingFormProps {
  initialData?: BankingAccount
}

export function BankingForm({ initialData }: BankingFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    if (isEditing && initialData) {
      const result = await updateBankingAccount(initialData.id, formData)
      if (result.success) {
        toast.success("Banking account updated successfully!")
        router.push("/banking")
      } else {
        toast.error(result.error)
      }
      return result
    } else {
      const result = await createBankingAccount(formData)
      if (result.success) {
        toast.success("Banking account created successfully!")
        router.push("/banking")
      } else {
        toast.error(result.error)
      }
      return result
    }
  }, null)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Account Name</Label>
        <Input id="name" name="name" defaultValue={initialData?.name} required />
      </div>
      <Button type="submit" disabled={isPending}>
        {isEditing ? (isPending ? "Updating..." : "Update Account") : isPending ? "Creating..." : "Create Account"}
      </Button>
      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
    </form>
  )
}
