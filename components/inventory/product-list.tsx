'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Pencil, Trash2 } from 'lucide-react'

export type Product = {
  id: string
  name: string
  sku?: string
  category?: string
  stock?: number
  price?: number
}

export type ProductListProps = {
  products?: Product[]
}

export default function ProductList({ products = [] }: ProductListProps) {
  const data =
    products.length > 0
      ? products
      : [
          { id: 'p1', name: 'Solar Panel 200W', sku: 'SP-200', category: 'Panels', stock: 24, price: 129.99 },
          { id: 'p2', name: 'Charge Controller 40A', sku: 'CC-40A', category: 'Controllers', stock: 10, price: 89 },
          { id: 'p3', name: 'Deep Cycle Battery 12V', sku: 'BAT-12V', category: 'Batteries', stock: 6, price: 159 },
        ]

  const fmt = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' })

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
          {data.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell className="text-muted-foreground">{p.sku ?? '-'}</TableCell>
              <TableCell className="hidden md:table-cell">{p.category ?? '-'}</TableCell>
              <TableCell className="text-right">{p.stock ?? 0}</TableCell>
              <TableCell className="text-right">{p.price != null ? fmt.format(p.price) : '-'}</TableCell>
              <TableCell className="text-right">
                <div className="inline-flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/inventory/${p.id}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => alert(`Delete product ${p.name}`)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
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
