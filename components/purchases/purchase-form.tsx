"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createPurchase } from "@/app/purchases/actions"

type Product = { id: string; name: string }
type Supplier = { id: string; name: string }

export type PurchaseFormProps = {
  products: Product[]
  suppliers: Supplier[]
}

export function PurchaseForm({ products, suppliers }: PurchaseFormProps) {
  // React 18 DOM typings workaround: cast Server Action to string
  const formAction = createPurchase as unknown as string

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-2">
        <Label>Product</Label>
        <input type="hidden" name="product_id" />
        <Select
          onValueChange={(v) => {
            const el = document.querySelector<HTMLInputElement>('input[name="product_id"]')
            if (el) el.value = v
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Supplier</Label>
        <input type="hidden" name="supplier_id" />
        <Select
          onValueChange={(v) => {
            const el = document.querySelector<HTMLInputElement>('input[name="supplier_id"]')
            if (el) el.value = v
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select supplier" />
          </SelectTrigger>
          <SelectContent>
            {suppliers.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input id="quantity" name="quantity" type="number" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="total_amount">Total Amount</Label>
        <Input id="total_amount" name="total_amount" type="number" step="0.01" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="purchase_date">Purchase Date</Label>
        <Input
          id="purchase_date"
          name="purchase_date"
          type="date"
          defaultValue={new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Create Purchase
      </Button>
    </form>
  )
}

// Also export default so both named and default imports work
export default PurchaseForm
