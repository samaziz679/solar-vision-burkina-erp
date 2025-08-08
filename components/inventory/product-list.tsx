'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'

export type Product = {
  id: string
  name: string
  sku?: string
  category?: string
  stock: number
  price: number
}

export type ProductListProps = {
  products?: Product[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

const fallbackProducts: Product[] = [
  { id: 'p1', name: 'Solar Panel 200W', sku: 'SP-200', category: 'Panels', stock: 24, price: 129.99 },
  { id: 'p2', name: 'Charge Controller 40A', sku: 'CC-40A', category: 'Controllers', stock: 10, price: 89.0 },
  { id: 'p3', name: 'Deep Cycle Battery 12V', sku: 'BAT-12V', category: 'Batteries', stock: 6, price: 159.0 },
]

export default function ProductList({
  products = fallbackProducts,
  onEdit,
  onDelete,
}: ProductListProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[180px]">Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.sku ?? '-'}</TableCell>
              <TableCell>{product.category ?? '-'}</TableCell>
              <TableCell className="text-right">{product.stock}</TableCell>
              <TableCell className="text-right">
                {'$' + product.price.toFixed(2)}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(product.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete?.(product.id)}
                >
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
