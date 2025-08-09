"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export type Product = {
  id: string
  name: string
  sku?: string | null
  category?: string | null
  stock_quantity?: number | null
  stock?: number | null
  price?: number | null
}

export type ProductListProps = {
  products?: Product[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function ProductList({ products = [], onEdit, onDelete }: ProductListProps) {
  const fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" })

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[180px]">Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell className="text-muted-foreground">{p.sku ?? "-"}</TableCell>
              <TableCell className="hidden md:table-cell">{p.category ?? "-"}</TableCell>
              <TableCell className="text-right">{p.stock_quantity ?? p.stock ?? 0}</TableCell>
              <TableCell className="text-right">{fmt.format(Number(p.price ?? 0))}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/inventory/${p.id}/edit`}>Edit</Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete?.(p.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
