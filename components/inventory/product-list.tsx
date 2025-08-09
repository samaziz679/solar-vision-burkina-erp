"use client"
import type { Product as DBProduct } from "@/lib/supabase/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type Props = {
  products: DBProduct[]
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
})

export default function ProductList({ products = [] }: Props) {
  if (!products.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No products found. Click "Add New Product" to create your first item.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[160px]">Name</TableHead>
            <TableHead className="min-w-[120px]">SKU</TableHead>
            <TableHead className="min-w-[100px] text-right">Price</TableHead>
            <TableHead className="min-w-[100px] text-right">Stock</TableHead>
            <TableHead className="w-[120px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell className="text-muted-foreground">{p.sku ?? "N/A"}</TableCell>
              <TableCell className="text-right">{currency.format(Number(p.price ?? 0))}</TableCell>
              <TableCell className="text-right">{p.stock_quantity}</TableCell>
              <TableCell className="text-right">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/inventory/${p.id}/edit`}>Edit</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
