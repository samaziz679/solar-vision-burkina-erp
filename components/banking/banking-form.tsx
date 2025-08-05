"use client"

import type React from "react"

import { useState } from "react"
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
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    try {
      let result
      if (isEditing && initialData) {
        result = await updateBankingAccount(initialData.id, formData)
      } else {
        result = await createBankingAccount(formData)
      }

      if (result.success) {
        toast.success(isEditing ? "Banking account updated successfully!" : "Banking account created successfully!")
        router.push("/banking")
      } else {
        toast.error(result.error)
        setError(result.error)
      }
    } catch (e: any) {
      toast.error("An unexpected error occurred.", { description: e.message })
      setError(e.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Account Name</Label>
        <Input id="name" name="name" defaultValue={initialData?.name} required />
      </div>
      <Button type="submit" disabled={isPending}>
        {isEditing ? (isPending ? "Updating..." : "Update Account") : isPending ? "Creating..." : "Create Account"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  )
}
