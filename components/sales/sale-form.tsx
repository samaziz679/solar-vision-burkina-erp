"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createSale } from "@/app/sales/actions"

type Product = { id: string; name: string }
type Client = { id: string; name: string }

export type SaleFormProps = {
  products: Product[]
  clients: Client[]
}

export function SaleForm({ products, clients }: SaleFormProps) {
  const formAction = createSale as unknown as string

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-2">
        <Label>Product</Label>
        <input type="hidden" name="product_id" />
        <Select
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
        <input type="hidden" name="client_id" />
        <Select onValueChange={(v) => (document.querySelector<HTMLInputElement>('input[name="client_id"]')!.value = v)}>
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
        <Input id="quantity" name="quantity" type="number" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="total_amount">Total Amount</Label>
        <Input id="total_amount" name="total_amount" type="number" step="0.01" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="sale_date">Sale Date</Label>
        <Input
          id="sale_date"
          name="sale_date"
          type="date"
          defaultValue={new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Create Sale
      </Button>
    </form>
  )
}
