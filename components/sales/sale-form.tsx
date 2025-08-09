"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatMoney, getActiveCurrency, formatAmount } from "@/lib/currency"

// Minimal shapes expected by the form
export type ProductForSale = {
  id: string
  name: string
  prix_vente_detail_1: number | null
  prix_vente_detail_2: number | null
  prix_vente_gros: number | null
}

export type ClientOption = {
  id: string
  name: string | null
}

type Props = {
  products: ProductForSale[]
  clients: ClientOption[]
  // Optional: if you wire a server action, you can pass it in and cast on the page.
  action?: (formData: FormData) => Promise<any>
}

export function SaleForm({ products = [], clients = [], action }: Props) {
  const [productId, setProductId] = useState(products[0]?.id ?? "")
  const [clientId, setClientId] = useState(clients[0]?.id ?? "")
  const [quantity, setQuantity] = useState<number>(1)
  const [unitPrice, setUnitPrice] = useState<number>(0)
  const [saleDate, setSaleDate] = useState<string>(() => {
    const d = new Date()
    // yyyy-mm-dd
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  })

  const currency = getActiveCurrency()

  const selectedProduct = useMemo(() => products.find((p) => p.id === productId) ?? null, [products, productId])

  // Set an initial unit price when product changes (prefer detail_1, else detail_2, else gros)
  useEffect(() => {
    if (!selectedProduct) return
    const { prix_vente_detail_1, prix_vente_detail_2, prix_vente_gros } = selectedProduct
    const firstAvailable =
      prix_vente_detail_1 ?? undefined ?? prix_vente_detail_2 ?? undefined ?? prix_vente_gros ?? undefined
    setUnitPrice(firstAvailable != null ? Number(firstAvailable) : 0)
  }, [selectedProduct])

  const total = useMemo(() => {
    const q = Number(quantity)
    const u = Number(unitPrice)
    if (!Number.isFinite(q) || !Number.isFinite(u)) return 0
    return Math.max(0, q) * Math.max(0, u)
  }, [quantity, unitPrice])

  function pickPrice(val: number | null) {
    if (val == null) return
    setUnitPrice(Number(val))
  }

  const onSubmit = action ? (action as unknown as (formData: FormData) => void) : undefined

  return (
    <form action={onSubmit} className="grid gap-6">
      {/* Product */}
      <div className="grid gap-2">
        <Label htmlFor="product_id">Product</Label>
        <select
          id="product_id"
          name="product_id"
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        >
          {products.length === 0 ? (
            <option value="">No products</option>
          ) : (
            products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))
          )}
        </select>
        {selectedProduct ? (
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={selectedProduct.prix_vente_detail_1 == null}
              onClick={() => pickPrice(selectedProduct.prix_vente_detail_1)}
            >
              Detail 1: {formatMoney(selectedProduct.prix_vente_detail_1)}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={selectedProduct.prix_vente_detail_2 == null}
              onClick={() => pickPrice(selectedProduct.prix_vente_detail_2)}
            >
              Detail 2: {formatMoney(selectedProduct.prix_vente_detail_2)}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={selectedProduct.prix_vente_gros == null}
              onClick={() => pickPrice(selectedProduct.prix_vente_gros)}
            >
              Wholesale: {formatMoney(selectedProduct.prix_vente_gros)}
            </Button>
          </div>
        ) : null}
      </div>

      {/* Client */}
      <div className="grid gap-2">
        <Label htmlFor="client_id">Client</Label>
        <select
          id="client_id"
          name="client_id"
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
        >
          {clients.length === 0 ? (
            <option value="">No clients</option>
          ) : (
            <>
              <option value="">Select client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name ?? "Unnamed"}
                </option>
              ))}
            </>
          )}
        </select>
      </div>

      {/* Quantity */}
      <div className="grid gap-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          step={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
          inputMode="numeric"
        />
      </div>

      {/* Unit Price (free input) */}
      <div className="grid gap-2">
        <Label htmlFor="unit_price">Unit Price</Label>
        <Input
          id="unit_price"
          name="unit_price"
          type="number"
          step={currency === "XOF" ? 1 : 0.01}
          min={0}
          value={unitPrice}
          onChange={(e) => setUnitPrice(Number(e.target.value))}
          inputMode="decimal"
          placeholder={formatAmount(0)}
        />
        <p className="text-xs text-muted-foreground">
          You can enter any price or use the buttons above to pick Detail 1 / Detail 2 / Wholesale.
        </p>
      </div>

      {/* Sale Date */}
      <div className="grid gap-2">
        <Label htmlFor="sale_date">Sale Date</Label>
        <Input
          id="sale_date"
          name="sale_date"
          type="date"
          value={saleDate}
          onChange={(e) => setSaleDate(e.target.value)}
          required
        />
      </div>

      {/* Computed total (read-only display) */}
      <div className="grid gap-1">
        <Label>Total</Label>
        <div className="h-10 rounded-md border border-input bg-muted/30 px-3 py-2 text-sm flex items-center justify-between">
          <span className="text-muted-foreground">Quantity × Unit Price</span>
          <span className="font-semibold tabular-nums">{formatMoney(total)}</span>
        </div>
        {/* Hidden actual numeric field that server action/route can read */}
        <input type="hidden" name="total_amount" value={total} />
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full">
          Create Sale
        </Button>
      </div>
    </form>
  )
}

export default SaleForm
