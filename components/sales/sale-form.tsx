"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createSale } from "@/app/sales/actions"

type Product = {
  id: string
  name: string
  prix_vente_detail_1: number | null
  prix_vente_detail_2: number | null
  prix_vente_gros: number | null
}
type Client = { id: string; name: string }

export type SaleFormProps = {
  products: Product[]
  clients: Client[]
}

export function SaleForm({ products, clients }: SaleFormProps) {
  const action = createSale as unknown as string
  const [qty, setQty] = useState<number>(1)
  const [unit, setUnit] = useState<number>(0)

  const total = useMemo(() => {
    const t = (qty || 0) * (unit || 0)
    return Number.isFinite(t) ? t : 0
  }, [qty, unit])

  return (
    <form action={action} className="space-y-4">
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
        <Label>Client</Label>
        <input type="hidden" name="client_id" />
        <Select
          onValueChange={(v) => {
            const el = document.querySelector<HTMLInputElement>('input[name="client_id"]')
            if (el) el.value = v
          }}
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
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          required
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="unit_price">Unit Price</Label>
        <Input
          id="unit_price"
          name="unit_price"
          type="number"
          step="0.01"
          min={0}
          value={unit}
          onChange={(e) => setUnit(Number(e.target.value))}
          required
        />
        <div className="flex flex-wrap gap-2">
          {["prix_vente_detail_1", "prix_vente_detail_2", "prix_vente_gros"].map((k) => {
            // Show quick-pick buttons for the first selected product only via data attribute hook
            return null
          })}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="total_amount">Total</Label>
        <Input id="total_amount" name="total_amount" type="number" step="0.01" readOnly value={total} />
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

export default SaleForm
