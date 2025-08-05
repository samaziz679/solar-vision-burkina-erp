"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Client } from "@/lib/supabase/types"
import { createClient, updateClient } from "@/app/clients/actions"
import { toast } from "sonner"

interface ClientFormProps {
  initialData?: Client
}

export function ClientForm({ initialData }: ClientFormProps) {
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
        result = await updateClient(initialData.id, formData)
      } else {
        result = await createClient(formData)
      }

      if (result.success) {
        toast.success(isEditing ? "Client updated successfully!" : "Client created successfully!")
        router.push("/clients")
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
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={initialData?.name} required />
      </div>
      <div>
        <Label htmlFor="contact_person">Contact Person</Label>
        <Input id="contact_person" name="contact_person" defaultValue={initialData?.contact_person} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={initialData?.email} required />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={initialData?.phone} required />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" name="address" defaultValue={initialData?.address} required />
      </div>
      <Button type="submit" disabled={isPending}>
        {isEditing ? (isPending ? "Updating..." : "Update Client") : isPending ? "Creating..." : "Create Client"}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  )
}
