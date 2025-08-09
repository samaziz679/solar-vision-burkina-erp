"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createSupplier, updateSupplier } from "@/app/suppliers/actions"

type Supplier = {
  id: string
  name: string
  contact_person: string | null
  email: string | null
  phone_number: string | null
  address: string | null
  created_at: string
  user_id: string
}

export type SupplierFormProps = {
  initialData?: Supplier | null
}

function SupplierForm({ initialData = null }: SupplierFormProps) {
  const [isPending, setIsPending] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({})

  // Choose the server action at render time
  const serverAction = initialData ? updateSupplier : createSupplier

  return (
    <Card>
      <CardContent className="pt-6">
        <form method="post" onSubmit={() => setIsPending(true)} className="space-y-4">
          <input type="hidden" name="id" value={initialData?.id ?? ""} />

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={initialData?.name ?? ""}
              placeholder="Acme Supplies Ltd"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.join(", ")}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contact_person">Contact person</Label>
            <Input
              id="contact_person"
              name="contact_person"
              defaultValue={initialData?.contact_person ?? ""}
              placeholder="John Doe"
            />
            {errors.contact_person && <p className="text-sm text-destructive">{errors.contact_person.join(", ")}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              defaultValue={initialData?.email ?? ""}
              placeholder="supplier@example.com"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.join(", ")}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone_number">Phone number</Label>
            <Input
              id="phone_number"
              name="phone_number"
              defaultValue={initialData?.phone_number ?? ""}
              placeholder="+1 555 555 5555"
            />
            {errors.phone_number && <p className="text-sm text-destructive">{errors.phone_number.join(", ")}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              defaultValue={initialData?.address ?? ""}
              placeholder="123 Main St, City, Country"
            />
            {errors.address && <p className="text-sm text-destructive">{errors.address.join(", ")}</p>}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              // Bind the server action on the button for React 18 DOM typings; cast to satisfy TS.
              formAction={serverAction as unknown as (formData: FormData) => void}
              disabled={isPending}
            >
              {isPending ? (initialData ? "Saving..." : "Creating...") : initialData ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default SupplierForm
export { SupplierForm }
