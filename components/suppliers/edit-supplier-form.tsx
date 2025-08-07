'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateSupplier } from '@/app/suppliers/actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Database } from '@/lib/supabase/types'

type Supplier = Database['public']['Tables']['suppliers']['Row']

interface EditSupplierFormProps {
  initialData: Supplier
}

export function EditSupplierForm({ initialData }: EditSupplierFormProps) {
  const [name, setName] = useState(initialData.name || '')
  const [contactPerson, setContactPerson] = useState(initialData.contact_person || '')
  const [email, setEmail] = useState(initialData.email || '')
  const [phone, setPhone] = useState(initialData.phone || '')
  const [address, setAddress] = useState(initialData.address || '')
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData()
    formData.append('id', initialData.id)
    formData.append('name', name)
    formData.append('contact_person', contactPerson)
    formData.append('email', email)
    formData.append('phone', phone)
    formData.append('address', address)

    let result = await updateSupplier(formData)

    if (result.success) {
      toast.success('Supplier updated successfully!')
      router.push('/suppliers')
    } else {
      toast.error(result.message || 'Failed to update supplier.')
      if (result.errors) {
        result.errors.forEach(err => toast.error(err.message));
      }
    }
    setIsPending(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isPending}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contact_person">Contact Person</Label>
        <Input
          id="contact_person"
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
          disabled={isPending}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isPending}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isPending}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  )
}

// This file is no longer needed as supplier-form.tsx handles both create and edit.
// It will be removed in a future update.
