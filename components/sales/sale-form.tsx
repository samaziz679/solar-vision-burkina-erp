"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency, getActiveCurrency } from "@/lib/currency"
import { createSale } from "@/app/sales/actions"

type Product = {
  id: string
  name: string
  quantity?: number | null
  prix_vente_detail_1?: number | null
  prix_vente_detail_2?: number | null
  prix_vente_gros?: number | null
}

type Client = { id: string; name: string }

type Props = {
  products: Product[]
  clients: Client[]
}

export default function SaleForm({ products, clients }: Props) {
  const [productId, setProductId] = useState<string>("")
  const [clientId, setClientId] = useState<string>("")
  const [qty, setQty] = useState<number>(1)
  const [unitPrice, setUnitPrice] = useState<number>(0)

  const currency = getActiveCurrency()

  const selectedProduct = useMemo(() => products.find((p) => p.id === productId), [products, productId])

  const total = useMemo(() => {
    const q = Number.isFinite(Number(qty)) ? Number(qty) : 0
    const u = Number.isFinite(Number(unitPrice)) ? Number(unitPrice) : 0
    return q * u
  }, [qty, unitPrice])

  const tierPrices = useMemo(() => {
    const d1 = Number(selectedProduct?.prix_vente_detail_1 ?? Number.NaN)
    const d2 = Number(selectedProduct?.prix_vente_detail_2 ?? Number.NaN)
    const gros = Number(selectedProduct?.prix_vente_gros ?? Number.NaN)
    return {
      d1: Number.isFinite(d1) ? d1 : undefined,
      d2: Number.isFinite(d2) ? d2 : undefined,
      gros: Number.isFinite(gros) ? gros : undefined,
    }
  }, [selectedProduct])

  const formAction = createSale as unknown as string

  return (
    <form action={formAction} className="space-y-4">
      {/* Hidden fields that server action expects */}
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="client_id" value={clientId} />
      <input type="hidden" name="total_amount" value={total} />

      <div className="grid gap-2">
        <Label>Product</Label>
        <Select
          value={productId}
          onValueChange={(v) => {
            setProductId(v)
            // When changing product, if tier1 exists use it as a sensible default
            const next = products.find((p) => p.id === v)
            const def =
              Number(next?.prix_vente_detail_1 ?? Number.NaN) ||
              Number(next?.prix_vente_detail_2 ?? Number.NaN) ||
              Number(next?.prix_vente_gros ?? Number.NaN) ||
              0
            setUnitPrice(def)
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
        <Select value={clientId} onValueChange={setClientId}>
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
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="unit_price">Unit Price ({currency})</Label>
        <Input
          id="unit_price"
          type="number"
          step="0.01"
          value={Number.isFinite(Number(unitPrice)) ? unitPrice : 0}
          onChange={(e) => setUnitPrice(Number(e.target.value))}
          placeholder="Enter any unit price"
        />
        {selectedProduct && (tierPrices.d1 || tierPrices.d2 || tierPrices.gros) ? (
          <div className="flex flex-wrap gap-2">
            {tierPrices.d1 !== undefined && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setUnitPrice(tierPrices.d1!)}
                title={`Detail 1: ${formatCurrency(tierPrices.d1, currency)}`}
              >
                Use Detail 1 ({formatCurrency(tierPrices.d1, currency)})
              </Button>
            )}
            {tierPrices.d2 !== undefined && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setUnitPrice(tierPrices.d2!)}
                title={`Detail 2: ${formatCurrency(tierPrices.d2, currency)}`}
              >
                Use Detail 2 ({formatCurrency(tierPrices.d2, currency)})
              </Button>
            )}
            {tierPrices.gros !== undefined && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setUnitPrice(tierPrices.gros!)}
                title={`Gross: ${formatCurrency(tierPrices.gros, currency)}`}
              >
                Use Gross ({formatCurrency(tierPrices.gros, currency)})
              </Button>
            )}
          </div>
        ) : null}
      </div>

      <div className="grid gap-1">
        <Label>Total</Label>
        <div className="text-lg font-semibold">{formatCurrency(total, currency)}</div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="sale_date">Sale Date</Label>
        <Input id="sale_date" name="sale_date" type="date" required />
      </div>

      <Button type="submit" className="w-full">
        Create Sale
      </Button>
    </form>
  )
}
