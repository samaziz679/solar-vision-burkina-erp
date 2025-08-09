"use client"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Match your Supabase row shape: `sku` can be null, and `stock_quantity` exists.
export type ProductRow = {
  id: string
  name: string
  description: string | null
  price: number
  sku: string | null
  stock_quantity: number
  user_id: string
  created_at: string
}

type Props = {
  products: ProductRow[]
}

function formatCurrency(value: number) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(value)
  } catch {
    return `$${value.toFixed(2)}`
  }
}

export default function ProductList({ products }: Props) {
  if (!products || products.length === 0) {
    return <div className="text-sm text-muted-foreground">No products found. Add a product to get started.</div>
  }

  return (
    <Table>
      <TableCaption>Inventory products</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">SKU</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">In Stock</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-mono text-xs">{p.sku ?? "-"}</TableCell>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell className="max-w-[420px] truncate">{p.description ?? "-"}</TableCell>
            <TableCell className="text-right">{formatCurrency(p.price)}</TableCell>
            <TableCell className="text-right">{p.stock_quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
