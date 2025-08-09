"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createSale } from "@/app/sales/actions"

type ProductForSale = {
  id: string
  name: string
  prix_vente_detail_1: number | null
  prix_vente_detail_2: number | null
  prix_vente_gros: number | null
}

type Client = { id: string; name: string }

export type SaleFormProps = {
  products: ProductForSale[]
  clients: Client[]
}

function fmt(n: number) {
  if (!Number.isFinite(n)) return ""
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n)
  } catch {
    return String(n)
  }
}

export function SaleForm({ products, clients }: SaleFormProps) {
  // Hidden inputs we keep in sync
  const productIdRef = useRef<HTMLInputElement>(null)
  const clientIdRef = useRef<HTMLInputElement>(null)
  const totalRef = useRef<HTMLInputElement>(null)

  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [unitPrice, setUnitPrice] = useState<number>(0)

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) ?? null,
    [products, selectedProductId],
  )

  // When product changes, default to first available tier price
  useEffect(() => {
    if (selectedProduct) {
      const candidates = [
        selectedProduct.prix_vente_detail_1,
        selectedProduct.prix_vente_detail_2,
        selectedProduct.prix_vente_gros,
      ].filter((v): v is number => typeof v === "number" && Number.isFinite(v))
      setUnitPrice(candidates[0] ?? 0)
    } else {
      setUnitPrice(0)
    }
  }, [selectedProductId]) // eslint-disable-line react-hooks/exhaustive-deps

  const totalAmount = useMemo(() => {
    const q = Number.isFinite(quantity) ? quantity : 0
    const u = Number.isFinite(unitPrice) ? unitPrice : 0
    return Math.max(0, Number((q * u).toFixed(2)))
  }, [quantity, unitPrice])

  // Keep hidden inputs in sync
  useEffect(() => {
    if (totalRef.current) totalRef.current.value = String(totalAmount)
  }, [totalAmount])

  const formAction = createSale as unknown as string

  return (
    <form action={formAction} className="space-y-6">
      {/* Product */}
      <div className="grid gap-2">
        <Label>Product</Label>
        <input type="hidden" name="product_id" ref={productIdRef} />
        <Select
          onValueChange={(v) => {
            setSelectedProductId(v)
            if (productIdRef.current) productIdRef.current.value = v
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
        {selectedProduct ? (
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>Quick price:</span>
            {[
              { label: "Detail 1", value: selectedProduct.prix_vente_detail_1 },
              { label: "Detail 2", value: selectedProduct.prix_vente_detail_2 },
              { label: "Wholesale", value: selectedProduct.prix_vente_gros },
            ]
              .filter((o) => typeof o.value === "number" && Number.isFinite(o.value as number))
              .map((o) => (
                <Button
                  key={o.label}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setUnitPrice(Number(o.value))}
                  className="h-7"
                >
                  {o.label}: {fmt(Number(o.value))}
                </Button>
              ))}
          </div>
        ) : null}
      </div>

      {/* Client */}
      <div className="grid gap-2">
        <Label>Client</Label>
        <input type="hidden" name="client_id" ref={clientIdRef} />
        <Select onValueChange={(v) => (clientIdRef.current ? (clientIdRef.current.value = v) : null)}>
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

      {/* Quantity */}
      <div className="grid gap-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min={0}
          step="1"
          required
          value={Number.isFinite(quantity) ? quantity : 0}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      {/* Unit Price */}
      <div className="grid gap-2">
        <Label htmlFor="unit_price">Unit Price</Label>
        <Input
          id="unit_price"
          type="number"
          step="0.01"
          inputMode="decimal"
          value={Number.isFinite(unitPrice) ? unitPrice : 0}
          onChange={(e) => setUnitPrice(Number(e.target.value))}
        />
      </div>

      {/* Total (computed) */}
      <div className="grid gap-2">
        <Label>Total</Label>
        <input ref={totalRef} type="hidden" name="total_amount" />
        <div className="h-10 rounded-md border px-3 py-2 text-sm flex items-center bg-muted/30 tabular-nums">
          {fmt(totalAmount)}
        </div>
      </div>

      {/* Sale Date */}
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
