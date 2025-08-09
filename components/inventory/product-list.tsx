"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

export default function ProductList({ products = [] as InventoryProduct[] }: { products?: InventoryProduct[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[180px]">Name</TableHead>
            <TableHead className="min-w-[120px]">SKU</TableHead>
            <TableHead className="min-w-[100px]">Price</TableHead>
            <TableHead className="min-w-[100px]">Stock</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.sku ?? "-"}</TableCell>
                <TableCell>{"$" + p.price.toFixed(2)}</TableCell>
                <TableCell>{p.stock_quantity}</TableCell>
                <TableCell className="max-w-[400px] truncate">{p.description ?? "-"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
