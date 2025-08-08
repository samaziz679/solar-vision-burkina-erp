'use client'

import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Edit, Trash2 } from 'lucide-react'

export type Product = {
  id: string
  name: string
  sku?: string
  price?: number
  stock?: number
  category?: string
}

type ProductListProps = {
  products?: Product[]
  onEdit?(product: Product): void
  onDelete?(product: Product): void
}

export default function ProductList({
  products,
  onEdit,
  onDelete,
}: ProductListProps) {
  const data = useMemo<Product[]>(
    () =>
      products && products.length > 0
        ? products
        : [
            { id: 'p1', name: 'Solar Panel 450W', sku: 'SP-450', price: 210, stock: 32, category: 'Panels' },
            { id: 'p2', name: 'Inverter 5kW', sku: 'INV-5K', price: 650, stock: 12, category: 'Inverters' },
            { id: 'p3', name: 'Battery 12V 200Ah', sku: 'BAT-200', price: 180, stock: 54, category: 'Batteries' },
          ],
    [products]
  )

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">SKU</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="text-right hidden sm:table-cell">Stock</TableHead>
            <TableHead className="text-right hidden sm:table-cell">Price</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="hidden md:table-cell">{product.sku ?? '-'}</TableCell>
              <TableCell className="hidden md:table-cell">{product.category ?? '-'}</TableCell>
              <TableCell className="text-right hidden sm:table-cell">
                {product.stock ?? 0}
              </TableCell>
              <TableCell className="text-right hidden sm:table-cell">
                {product.price != null ? `$${product.price.toFixed(2)}` : '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="inline-flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Edit"
                    onClick={() => onEdit?.(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete"
                    onClick={() => onDelete?.(product)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
