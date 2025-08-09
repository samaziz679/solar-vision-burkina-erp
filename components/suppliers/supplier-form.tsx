"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createSupplier, updateSupplier } from "@/app/suppliers/actions"
import type { Supplier } from "@/lib/supabase/types"

interface SupplierFormProps {
  initialData?: Supplier
}

function SupplierFormComponent({ initialData }: SupplierFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [contactPerson, setContactPerson] = useState(initialData?.contact_person || "")
  const [email, setEmail] = useState(initialData?.email || "")
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phone_number || "")
  const [address, setAddress] = useState(initialData?.address || "")
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "")
      setContactPerson(initialData.contact_person || "")
      setEmail(initialData.email || "")
      setPhoneNumber(initialData.phone_number || "")
      setAddress(initialData.address || "")
    }
  }, [initialData])

  // Choose the correct Server Action and cast for React 18 DOM typings
  const formAction = (initialData ? updateSupplier : createSupplier) as unknown as (formData: FormData) => void

  return (
    <form action={formAction as unknown as string} onSubmit={() => setIsPending(true)} className="space-y-4">
      <input type="hidden" name="id" value={initialData?.id ?? ""} />

      <div className="grid gap-2">
        <Label htmlFor="name">Supplier Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Solar Parts Ltd."
          required
          disabled={isPending}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="contact_person">Contact Person</Label>
        <Input
          id="contact_person"
          name="contact_person"
          type="text"
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
          placeholder="e.g., Jane Smith"
          disabled={isPending}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g., jane.smith@example.com"
          required
          disabled={isPending}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          name="phone_number"
          type="tel"
          value={phoneNumber ?? ""}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="e.g., +1987654321"
          required
          disabled={isPending}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          value={address ?? ""}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g., 456 Panel Rd, Solarville"
          required
          disabled={isPending}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending
          ? initialData
            ? "Updating..."
            : "Creating..."
          : initialData
            ? "Update Supplier"
            : "Create Supplier"}
      </Button>
    </form>
  )
}

// Export both named and default so existing imports continue to work
export { SupplierFormComponent as SupplierForm }
export default SupplierFormComponent
