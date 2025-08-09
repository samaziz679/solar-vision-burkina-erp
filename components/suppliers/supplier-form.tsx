"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createSupplier, updateSupplier } from "@/app/suppliers/actions"
import { toast } from "sonner"
import type { Supplier } from "@/lib/supabase/types"

interface SupplierFormProps {
  initialData?: Supplier
}

export function SupplierForm({ initialData }: SupplierFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [contactPerson, setContactPerson] = useState(initialData?.contact_person || "")
  const [email, setEmail] = useState(initialData?.email || "")
  const [phone, setPhone] = useState(initialData?.phone || "")
  const [address, setAddress] = useState(initialData?.address || "")
  const [isPending, setIsPending] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "")
      setContactPerson(initialData.contact_person || "")
      setEmail(initialData.email || "")
      setPhone(initialData.phone || "")
      setAddress(initialData.address || "")
    }
  }, [initialData])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsPending(true)
    setErrors({})
    setMessage(null)

    const formData = new FormData(event.currentTarget)
    if (initialData?.id) {
      formData.append("id", initialData.id)
    }

    const action = initialData ? updateSupplier : createSupplier
    const result = await action(undefined, formData) // Pass undefined for prevState

    if (result?.errors) {
      setErrors(result.errors)
      setMessage(result.message)
      toast.error(result.message)
    } else if (result?.message) {
      setMessage(result.message)
      toast.error(result.message)
    } else {
      toast.success(initialData ? "Supplier updated successfully!" : "Supplier created successfully!")
    }
    setIsPending(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="id" value={initialData?.id} />
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
        {errors.name && <p className="text-red-500 text-sm">{errors.name.join(", ")}</p>}
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
        {errors.contact_person && <p className="text-red-500 text-sm">{errors.contact_person.join(", ")}</p>}
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
        {errors.email && <p className="text-red-500 text-sm">{errors.email.join(", ")}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g., +1987654321"
          required
          disabled={isPending}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.join(", ")}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g., 456 Panel Rd, Solarville"
          required
          disabled={isPending}
        />
        {errors.address && <p className="text-red-500 text-sm">{errors.address.join(", ")}</p>}
      </div>
      {message && <p className="text-red-500 text-sm">{message}</p>}
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
