"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateSale } from "@/app/sales/actions"

type Product = { id: string; name: string }
type Client = { id: string; name: string }
type Sale = {
  id: string
  product_id: string
  client_id: string
  quantity: number
  total_amount: number
  sale_date: string
}

export type EditSaleFormProps = {
  initialData: Sale
  products: Product[]
  clients: Client[]
}

export function EditSaleForm({ initialData, products, clients }: EditSaleFormProps) {
  const formAction = updateSale.bind(null, initialData.id) as unknown as string

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
        <Label>Client</Label>
        <input type="hidden" name="client_id" value={initialData.client_id} />
        <Select
          defaultValue={initialData.client_id}
          onValueChange={(v) => (document.querySelector<HTMLInputElement>('input[name="client_id"]')!.value = v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
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
        <Label htmlFor="sale_date">Sale Date</Label>
        <Input id="sale_date" name="sale_date" type="date" defaultValue={initialData.sale_date} required />
      </div>

      <Button type="submit" className="w-full">
        Update Sale
      </Button>
    </form>
  )
}
