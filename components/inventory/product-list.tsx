import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export type InventoryProduct = {
  id: string
  name: string
  sku: string | null
  category: string | null
  unit_price: number
  stock: number
  user_id: string
  created_at: string
}

interface ProductListProps {
  products: InventoryProduct[]
}

export default function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return <div className="text-sm text-muted-foreground">No products found.</div>
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Name</TableHead>
            <TableHead className="min-w-[140px]">SKU</TableHead>
            <TableHead className="min-w-[160px]">Category</TableHead>
            <TableHead className="min-w-[120px] text-right">Unit Price</TableHead>
            <TableHead className="min-w-[100px] text-right">Stock</TableHead>
            <TableHead className="min-w-[160px]">Added</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell>{p.sku ?? "—"}</TableCell>
              <TableCell>{p.category ?? "—"}</TableCell>
              <TableCell className="text-right">{formatCurrency(p.unit_price)}</TableCell>
              <TableCell className="text-right">{p.stock}</TableCell>
              <TableCell>{formatDate(p.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function formatCurrency(value: number) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(
      value ?? 0,
    )
  } catch {
    return `$${Number(value ?? 0).toFixed(2)}`
  }
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" })
}
