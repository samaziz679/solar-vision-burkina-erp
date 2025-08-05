"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Supplier } from "@/lib/supabase/types"
import { createSupplier, updateSupplier } from "@/app/suppliers/actions"
import { toast } from "sonner"

interface SupplierFormProps {
  initialData?: Supplier
}

export function SupplierForm({ initialData }: SupplierFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    if (isEditing && initialData) {
      const result = await updateSupplier(initialData.id, formData)
      if (result.success) {
        toast.success("Supplier updated successfully!")
        router.push("/suppliers")
      } else {
        toast.error(result.error)
      }
      return result
    } else {
      const result = await createSupplier(formData)
      if (result.success) {
        toast.success("Supplier created successfully!")
        router.push("/suppliers")
      } else {
        toast.error(result.error)
      }
      return result
    }
  }, null)

  return (
    <form action={formAction} className="space-y-4">
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
        {isEditing ? (isPending ? "Updating..." : "Update Supplier") : isPending ? "Creating..." : "Create Supplier"}
      </Button>
      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
    </form>
  )
}
