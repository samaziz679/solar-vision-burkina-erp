"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"

export type InventoryProduct = {
  id: string
  name: string
  sku: string | null
  price: number
  stock_quantity: number
  description: string | null
  created_at: string
  user_id: string
}

type ProductListProps = {
  products: InventoryProduct[]
}

function formatCurrency(value: number) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
  } catch {
    return String(value)
  }
}

export default function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">No products found.</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-muted-foreground">{p.sku ?? "—"}</TableCell>
                <TableCell className="text-right">{formatCurrency(p.price)}</TableCell>
                <TableCell className="text-right">{p.stock_quantity}</TableCell>
                <TableCell className="max-w-[320px] truncate">{p.description ?? "—"}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {new Date(p.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
