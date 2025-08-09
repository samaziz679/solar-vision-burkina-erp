"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updatePurchase } from "@/app/purchases/actions"

type Product = { id: string; name: string }
type Supplier = { id: string; name: string }
type Purchase = {
  id: string
  product_id: string
  supplier_id: string
  quantity: number
  total_amount: number
  purchase_date: string
}

export type EditPurchaseFormProps = {
  initialData: Purchase
  products: Product[]
  suppliers: Supplier[]
}

export function EditPurchaseForm({ initialData, products, suppliers }: EditPurchaseFormProps) {
  const formAction = updatePurchase.bind(null, initialData.id) as unknown as string

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={initialData.id} />

      <div className="grid gap-2">
        <Label>Product</Label>
        <input type="hidden" name="product_id" value={initialData.product_id} />
        <Select
          defaultValue={initialData.product_id}
          onValueChange={(v) => (document.querySelector<HTMLInputElement>('input[name="product_id"]')!.value = v)}
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
        <input type="hidden" name="supplier_id" value={initialData.supplier_id} />
        <Select
          defaultValue={initialData.supplier_id}
          onValueChange={(v) => (document.querySelector<HTMLInputElement>('input[name="supplier_id"]')!.value = v)}
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
        <Input id="quantity" name="quantity" type="number" defaultValue={initialData.quantity} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="total_amount">Total Amount</Label>
        <Input
          id="total_amount"
          name="total_amount"
          type="number"
          step="0.01"
          defaultValue={initialData.total_amount}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="purchase_date">Purchase Date</Label>
        <Input id="purchase_date" name="purchase_date" type="date" defaultValue={initialData.purchase_date} required />
      </div>

      <Button type="submit" className="w-full">
        Update Purchase
      </Button>
    </form>
  )
}
